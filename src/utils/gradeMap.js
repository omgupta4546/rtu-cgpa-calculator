/**
 * RTU Official Grade Point Mapping
 * 
 * This mapping is used across the entire application.
 * Update this single file if RTU changes their grading system.
 */

export const gradePoints = {
  "A++": 10,
  "A+": 9,
  "A": 8.5,
  "B+": 8,
  "B": 7.5,
  "C+": 7,
  "C": 6.5,
  "D+": 6,
  "D": 5.5,
  "E+": 5,
  "E": 4,
  "F": 0,
};

// Ordered list of grades for dropdown display
export const gradeList = [
  "A++", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "E+", "E", "F"
];

// Minimum grade point to pass (RTU rule)
export const PASS_GRADE_POINT = 4;

/**
 * Get the grade point for a given grade.
 * @param {string} grade - Grade string (e.g., "A+")
 * @returns {number} Grade point value
 */
export function getGradePoint(grade) {
  return gradePoints[grade] ?? 0;
}

/**
 * Check if a grade is a passing grade.
 * @param {string} grade - Grade string
 * @returns {boolean}
 */
export function isPassingGrade(grade) {
  return getGradePoint(grade) >= PASS_GRADE_POINT;
}
