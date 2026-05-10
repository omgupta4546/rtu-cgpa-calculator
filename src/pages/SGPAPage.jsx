import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BranchSelector from '../components/BranchSelector';
import SubjectTable from '../components/SubjectTable';
import ResultCard from '../components/ResultCard';
import PdfUpload from '../components/PdfUpload';
import { branches, getSubjects, availableSemesters, getSemesterLabel } from '../data';
import { useGrades } from '../hooks/useGrades';
import { calculateSGPA } from '../utils/calculator';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

export default function SGPAPage() {
  const [selectedBranch, setSelectedBranch] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SELECTED_BRANCH, '')
  );
  const [selectedSemester, setSelectedSemester] = useState(() =>
    loadFromStorage('selected_semester_sgpa', 3)
  );
  const [pdfImportInfo, setPdfImportInfo] = useState(null);

  const { grades, setGrade, setMultipleGrades, resetGrades } = useGrades(selectedBranch, selectedSemester);

  const semesters = useMemo(() => {
    if (!selectedBranch) return [];
    return availableSemesters[selectedBranch] || [];
  }, [selectedBranch]);

  const subjects = useMemo(() => {
    if (!selectedBranch) return [];
    return getSubjects(selectedBranch, selectedSemester) || [];
  }, [selectedBranch, selectedSemester]);

  const result = useMemo(() => {
    if (subjects.length === 0) return null;
    return calculateSGPA(subjects, grades);
  }, [subjects, grades]);

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    saveToStorage(STORAGE_KEYS.SELECTED_BRANCH, branchId);
    setPdfImportInfo(null);
  };

  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem);
    saveToStorage('selected_semester_sgpa', sem);
    setPdfImportInfo(null);
  };

  const handleReset = () => {
    resetGrades();
    setPdfImportInfo(null);
  };

  const handlePdfGradesExtracted = useCallback((gradeMap, info) => {
    setMultipleGrades(gradeMap);
    setPdfImportInfo(info);
  }, [setMultipleGrades]);

  const allGradesSelected = subjects.length > 0 && subjects.every(s => grades[s.code]);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          📊 SGPA Calculator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">
          SGPA Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Select your branch, semester, and grades to calculate your SGPA
        </p>
      </motion.div>

      {/* Branch Selection */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Branch</h2>
        <BranchSelector branches={branches} selectedBranch={selectedBranch} onSelect={handleBranchSelect} />
      </motion.section>

      {/* Semester Selection */}
      {selectedBranch && semesters.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Semester</h2>
          <div className="flex flex-wrap gap-3" id="semester-selector">
            {semesters.map((sem, index) => {
              const isSelected = selectedSemester === sem;
              return (
                <motion.button
                  key={sem}
                  id={`semester-${sem}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSemesterSelect(sem)}
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                    isSelected
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                  }`}
                >
                  {getSemesterLabel(sem)}
                  {sem <= 2 && (
                    <span className="block text-[10px] font-normal opacity-70 mt-0.5">Common</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* PDF Upload Section */}
      {selectedBranch && subjects.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              📄 Import from Result PDF
            </h2>
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
              New
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">
            Upload your RTU result PDF and grades will be auto-filled ✨
          </p>
          <PdfUpload
            onGradesExtracted={handlePdfGradesExtracted}
            subjects={subjects}
          />
          
          {/* PDF Import Success Toast */}
          <AnimatePresence>
            {pdfImportInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🎯</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                      {pdfImportInfo.matchedCount} out of {pdfImportInfo.totalExtracted} grades auto-filled!
                    </p>
                    {pdfImportInfo.studentInfo?.name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Result of: <span className="font-medium text-gray-700 dark:text-gray-300">{pdfImportInfo.studentInfo.name}</span>
                      </p>
                    )}
                    {pdfImportInfo.unmatchedCodes?.length > 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        ⚠️ {pdfImportInfo.unmatchedCodes.length} subjects not in current semester: {pdfImportInfo.unmatchedCodes.join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setPdfImportInfo(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {/* Subject Table */}
      {selectedBranch && subjects.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {selectedBranch} — {getSemesterLabel(selectedSemester)} Subjects
            </h2>
            <button
              onClick={handleReset}
              id="reset-grades-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors"
            >
              🔄 Reset
            </button>
          </div>

          <SubjectTable subjects={subjects} grades={grades} onGradeChange={setGrade} />
        </motion.section>
      )}

      {/* Results */}
      {result && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              title="Total Credits"
              value={result.totalCredits}
              icon="📚"
              color="purple"
              delay={0}
            />
            <ResultCard
              title="Credit Points"
              value={result.totalCreditPoints}
              icon="⭐"
              color="amber"
              delay={0.1}
            />
            <ResultCard
              title="SGPA"
              value={result.sgpa.toFixed(2)}
              subtitle={allGradesSelected ? 'All grades selected' : 'Select all grades for final SGPA'}
              icon="🏆"
              color="emerald"
              delay={0.2}
            />
          </div>

          {allGradesSelected && result.sgpa > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center shadow-xl shadow-indigo-500/30">
              <p className="text-sm font-medium opacity-80">Your {getSemesterLabel(selectedSemester)} SGPA</p>
              <p className="text-5xl font-extrabold font-outfit mt-2">{result.sgpa.toFixed(2)}</p>
              <p className="text-sm mt-2 opacity-70">
                {result.sgpa >= 9 ? '🌟 Outstanding!' : result.sgpa >= 8 ? '🎉 Excellent!' : result.sgpa >= 7 ? '👏 Very Good!' : result.sgpa >= 6 ? '👍 Good!' : result.sgpa >= 5 ? '📖 Keep Going!' : '💪 Work Harder!'}
              </p>
            </motion.div>
          )}
        </motion.section>
      )}
    </div>
  );
}
