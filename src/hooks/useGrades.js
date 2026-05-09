import { useState, useEffect, useCallback } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

/**
 * Custom hook for managing grades state with localStorage persistence.
 * 
 * @param {string} branch - Branch code
 * @param {number} semester - Semester number
 * @returns {{ grades: Object, setGrade: Function, resetGrades: Function }}
 */
export function useGrades(branch, semester) {
  const storageKey = `grades_${branch}_${semester}`;

  const [grades, setGrades] = useState(() => {
    return loadFromStorage(storageKey, {});
  });

  // Reset grades when branch or semester changes
  useEffect(() => {
    const saved = loadFromStorage(storageKey, {});
    setGrades(saved);
  }, [storageKey]);

  // Persist grades on change
  useEffect(() => {
    saveToStorage(storageKey, grades);
  }, [grades, storageKey]);

  const setGrade = useCallback((subjectCode, grade) => {
    setGrades(prev => ({
      ...prev,
      [subjectCode]: grade,
    }));
  }, []);

  const resetGrades = useCallback(() => {
    setGrades({});
  }, []);

  return { grades, setGrade, resetGrades };
}
