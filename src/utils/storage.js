/**
 * LocalStorage utility for persisting user data.
 * 
 * All keys are prefixed with 'rtu_' to avoid collisions.
 */

const PREFIX = 'rtu_';

/**
 * Save data to localStorage.
 * @param {string} key
 * @param {*} value - Will be JSON serialized
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

/**
 * Load data from localStorage.
 * @param {string} key
 * @param {*} defaultValue - Returned if key doesn't exist
 * @returns {*} Parsed value or defaultValue
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage.
 * @param {string} key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (e) {
    console.warn('Failed to remove from localStorage:', e);
  }
}

/**
 * Clear all RTU-related data from localStorage.
 */
export function clearAllStorage() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  SELECTED_BRANCH: 'selected_branch',
  GRADES: 'grades',           // grades_{branch}_{semester}
  SGPA: 'sgpa',               // sgpa_{branch}_{semester}
  CGPA: 'cgpa',               // cgpa_{branch}
  THEME: 'theme',
  SEM1_SGPA: 'sem1_sgpa',
  SEM2_SGPA: 'sem2_sgpa',
  SEM1_CREDITS: 'sem1_credits',
  SEM2_CREDITS: 'sem2_credits',
};
