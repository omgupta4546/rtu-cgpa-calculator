/**
 * Central data registry for all branches and semesters.
 * 
 * To add a new branch or semester:
 * 1. Create a new JSON file (e.g., cse_sem3.json)
 * 2. Import it here
 * 3. Add it to the semesterData map
 * 
 * The core logic doesn't need any changes.
 */

import commonSem1 from './common_sem1.json';
import commonSem2 from './common_sem2.json';
import eicSem3 from './eic_sem3.json';
import eicSem4 from './eic_sem4.json';
import eceSem3 from './ece_sem3.json';
import eceSem4 from './ece_sem4.json';

// Registry of all available branches
export const branches = [
  { id: 'EIC', name: 'EIC', fullName: 'Electronics Instrumentation & Control' },
  { id: 'ECE', name: 'ECE', fullName: 'Electronics & Communication Engineering' },
  // Add more branches here:
  // { id: 'CSE', name: 'CSE', fullName: 'Computer Science & Engineering' },
];

// Registry of available semesters per branch
// Semesters 1 & 2 are common across all branches
export const availableSemesters = {
  EIC: [1, 2, 3, 4],
  ECE: [1, 2, 3, 4],
  // Add more: CSE: [1, 2, 3, 4, 5],
};

// Semester data lookup: semesterData[branch][semester]
// Semesters 1 & 2 use common data for all branches
export const semesterData = {
  EIC: {
    1: commonSem1,
    2: commonSem2,
    3: eicSem3,
    4: eicSem4,
  },
  ECE: {
    1: commonSem1,
    2: commonSem2,
    3: eceSem3,
    4: eceSem4,
  },
  // Add more:
  // CSE: { 1: commonSem1, 2: commonSem2, 3: cseSem3 },
};

/**
 * Get subjects for a given branch and semester.
 * @param {string} branch - Branch code (e.g., 'EIC')
 * @param {number} semester - Semester number (e.g., 3)
 * @returns {Array|null} Array of subject objects or null if not found
 */
export function getSubjects(branch, semester) {
  return semesterData[branch]?.[semester]?.subjects || null;
}

/**
 * Get semester data for a given branch and semester.
 * @param {string} branch - Branch code
 * @param {number} semester - Semester number
 * @returns {Object|null} Semester data object or null
 */
export function getSemesterData(branch, semester) {
  return semesterData[branch]?.[semester] || null;
}

/**
 * Get total credits for a specific semester.
 * @param {string} branch
 * @param {number} semester
 * @returns {number}
 */
export function getTotalCredits(branch, semester) {
  const subjects = getSubjects(branch, semester);
  if (!subjects) return 0;
  return subjects.reduce((sum, sub) => sum + sub.credits, 0);
}
