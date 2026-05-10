import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import BranchSelector from '../components/BranchSelector';
import ResultCard from '../components/ResultCard';
import { branches, getTotalCredits, availableSemesters, getSemesterLabel } from '../data';
import { calculateCGPA } from '../utils/calculator';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

const badgeColorCycle = ['blue', 'violet', 'indigo', 'purple', 'cyan', 'teal', 'fuchsia', 'rose'];

// Fixed credits per semester (common semesters)
const FIXED_CREDITS = {
  1: 21,
  2: 21,
};

const badgeColorMap = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300',
  rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
};

export default function CGPAPage() {
  const [selectedBranch, setSelectedBranch] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SELECTED_BRANCH, '')
  );

  // Dynamic SGPA state per semester (stored as object)
  const [sgpaValues, setSgpaValues] = useState(() =>
    loadFromStorage('cgpa_sgpa_values', {})
  );

  // Get semesters for selected branch
  const semesters = useMemo(() => {
    if (!selectedBranch) return [];
    return availableSemesters[selectedBranch] || [];
  }, [selectedBranch]);

  // Get fixed credits for each semester
  const semesterCredits = useMemo(() => {
    const credits = {};
    for (const sem of semesters) {
      if (FIXED_CREDITS[sem]) {
        credits[sem] = FIXED_CREDITS[sem];
      } else if (selectedBranch) {
        credits[sem] = getTotalCredits(selectedBranch, sem);
      }
    }
    return credits;
  }, [semesters, selectedBranch]);

  // Persist SGPA values
  useEffect(() => {
    saveToStorage('cgpa_sgpa_values', sgpaValues);
  }, [sgpaValues]);

  const setSgpa = (sem, value) => {
    setSgpaValues(prev => ({ ...prev, [sem]: value }));
  };

  // CGPA calculation
  const cgpaResult = useMemo(() => {
    const entries = [];
    for (const sem of semesters) {
      const sgpa = parseFloat(sgpaValues[sem]);
      const credits = semesterCredits[sem];
      if (!isNaN(sgpa) && sgpa > 0 && credits > 0) {
        entries.push({ semester: sem, sgpa, totalCredits: credits });
      }
    }
    if (entries.length === 0) return null;
    return calculateCGPA(entries);
  }, [sgpaValues, semesterCredits, semesters]);

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    saveToStorage(STORAGE_KEYS.SELECTED_BRANCH, branchId);
  };

  const handleReset = () => {
    setSgpaValues({});
  };

  const maxSem = semesters.length > 0 ? Math.max(...semesters) : 3;

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-xs font-medium text-purple-700 dark:text-purple-300">
          📈 Up to {getSemesterLabel(maxSem)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">
          CGPA Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your SGPA for each semester to calculate weighted CGPA using RTU official formula
        </p>
      </motion.div>

      {/* Branch Selection */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Branch</h2>
        <BranchSelector branches={branches} selectedBranch={selectedBranch} onSelect={handleBranchSelect} />
      </motion.section>

      {selectedBranch && semesters.length > 0 && (
        <>
          {/* Semester SGPA Inputs */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Semester Details</h2>
              <button
                onClick={handleReset}
                id="reset-cgpa-btn"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                🔄 Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {semesters.map((sem, index) => {
                const color = badgeColorCycle[index % badgeColorCycle.length];
                return (
                  <motion.div
                    key={sem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${badgeColorMap[color]}`}>
                        {sem}
                      </span>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{getSemesterLabel(sem)}</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        SGPA <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={`sem${sem}-sgpa`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={sgpaValues[sem] || ''}
                        onChange={(e) => setSgpa(sem, e.target.value)}
                        placeholder="e.g., 7.50"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Total Credits
                      </label>
                      <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm font-semibold cursor-not-allowed">
                        {semesterCredits[sem] || '—'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* CGPA Results */}
          {cgpaResult && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">CGPA Results</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard title="Total Credits" value={cgpaResult.totalCredits} icon="📚" color="purple" />
                <ResultCard title="Total Credit Points" value={cgpaResult.totalCreditPoints} icon="⭐" color="amber" />
                <ResultCard title="Overall CGPA" value={cgpaResult.cgpa.toFixed(2)} icon="🏆" color="emerald" subtitle="Weighted average" />
              </div>

              {/* Semester Breakdown */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Semester Breakdown</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
                  {cgpaResult.semesterBreakdown.map((sem) => (
                    <div key={sem.semester} className="flex items-center justify-between px-6 py-4 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300">
                          {sem.semester}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {getSemesterLabel(sem.semester)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap">
                        <span className="text-gray-500 dark:text-gray-400">Credits: <span className="font-semibold text-gray-700 dark:text-gray-200">{sem.credits}</span></span>
                        <span className="text-gray-500 dark:text-gray-400">Points: <span className="font-semibold text-gray-700 dark:text-gray-200">{sem.creditPoints}</span></span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">SGPA: {sem.sgpa.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big CGPA Display */}
              {cgpaResult.cgpa > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-center shadow-xl shadow-purple-500/30">
                  <p className="text-sm font-medium opacity-80">Your Overall CGPA (Up to {getSemesterLabel(maxSem)})</p>
                  <p className="text-5xl font-extrabold font-outfit mt-2">{cgpaResult.cgpa.toFixed(2)}</p>
                  <p className="text-sm mt-2 opacity-70">
                    {cgpaResult.cgpa >= 9 ? '🌟 Outstanding Performance!' : cgpaResult.cgpa >= 8 ? '🎉 Excellent!' : cgpaResult.cgpa >= 7 ? '👏 Very Good!' : cgpaResult.cgpa >= 6 ? '👍 Good Job!' : cgpaResult.cgpa >= 5 ? '📖 Keep Improving!' : '💪 Stay Focused!'}
                  </p>
                </motion.div>
              )}
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
