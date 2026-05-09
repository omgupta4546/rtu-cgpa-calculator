/**
 * RTU Official SGPA & CGPA Calculation Utilities
 * 
 * SGPA = Σ(Credit × GradePoint) / Σ(Credits)
 * CGPA = Σ(Ci × gi) / Σ(Ci)  (only for passed subjects, grade >= 4)
 */

import { getGradePoint, PASS_GRADE_POINT } from './gradeMap';

/**
 * Calculate SGPA for a set of subjects with selected grades.
 * 
 * @param {Array} subjects - Array of { code, name, credits }
 * @param {Object} grades - Map of subjectCode -> grade string
 * @returns {{ sgpa: number, totalCredits: number, totalCreditPoints: number, subjectDetails: Array }}
 */
export function calculateSGPA(subjects, grades) {
  let totalCredits = 0;
  let totalCreditPoints = 0;
  const subjectDetails = [];

  for (const subject of subjects) {
    const grade = grades[subject.code] || '';
    const gradePoint = getGradePoint(grade);
    const creditPoints = subject.credits * gradePoint;

    totalCredits += subject.credits;
    totalCreditPoints += creditPoints;

    subjectDetails.push({
      ...subject,
      grade,
      gradePoint,
      creditPoints,
    });
  }

  const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;

  return {
    sgpa: Math.round(sgpa * 100) / 100,
    totalCredits,
    totalCreditPoints: Math.round(totalCreditPoints * 100) / 100,
    subjectDetails,
  };
}

/**
 * Calculate CGPA using RTU weighted credit formula.
 * 
 * This uses per-subject weighted calculation, NOT simple average of SGPAs.
 * Subjects with grade point < 4 (Fail) are excluded.
 * 
 * For semesters where only SGPA is available (not individual grades),
 * we use: semesterCredits * SGPA as the credit points contribution.
 * 
 * @param {Array} semesterEntries - Array of semester data:
 *   Each entry: { semester, sgpa, totalCredits, subjects?, grades? }
 *   - If subjects & grades are available, use per-subject calculation
 *   - If only sgpa & totalCredits are available, use SGPA * credits
 * @returns {{ cgpa: number, totalCredits: number, totalCreditPoints: number, semesterBreakdown: Array }}
 */
export function calculateCGPA(semesterEntries) {
  let totalCredits = 0;
  let totalCreditPoints = 0;
  const semesterBreakdown = [];

  for (const entry of semesterEntries) {
    let semCredits = 0;
    let semCreditPoints = 0;

    if (entry.subjects && entry.grades) {
      // Per-subject calculation (e.g., 3rd semester with grade-level data)
      for (const subject of entry.subjects) {
        const grade = entry.grades[subject.code] || '';
        const gradePoint = getGradePoint(grade);

        // RTU Rule: Exclude subjects with grade point < 4 (Fail)
        if (gradePoint >= PASS_GRADE_POINT) {
          semCredits += subject.credits;
          semCreditPoints += subject.credits * gradePoint;
        }
      }
    } else if (entry.sgpa > 0 && entry.totalCredits > 0) {
      // SGPA-based calculation (for semesters without grade-level data)
      // We assume all subjects passed if user provides SGPA
      semCredits = entry.totalCredits;
      semCreditPoints = entry.totalCredits * entry.sgpa;
    }

    totalCredits += semCredits;
    totalCreditPoints += semCreditPoints;

    semesterBreakdown.push({
      semester: entry.semester,
      credits: semCredits,
      creditPoints: Math.round(semCreditPoints * 100) / 100,
      sgpa: entry.sgpa || (semCredits > 0 ? semCreditPoints / semCredits : 0),
    });
  }

  const cgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;

  return {
    cgpa: Math.round(cgpa * 100) / 100,
    totalCredits,
    totalCreditPoints: Math.round(totalCreditPoints * 100) / 100,
    semesterBreakdown,
  };
}
