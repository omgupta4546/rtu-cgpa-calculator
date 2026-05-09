import { motion } from 'framer-motion';
import { gradeList, gradePoints } from '../utils/gradeMap';

export default function AboutPage() {
  return (
    <div className="space-y-10 py-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          ℹ️ Information
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">
          RTU Grading System
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Official grading system used by Rajasthan Technical University
        </p>
      </motion.div>

      {/* Grade Table */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Grade Point Mapping</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-gray-200 dark:border-gray-700/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <div>Grade</div>
            <div>Grade Point</div>
            <div>Status</div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {gradeList.map((grade, i) => {
              const point = gradePoints[grade];
              const isPassing = point >= 4;
              return (
                <motion.div key={grade} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.03 }}
                  className={`grid grid-cols-3 gap-4 px-6 py-3.5 items-center ${!isPassing ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                  <div>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-bold ${
                      isPassing
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {grade}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{point}</div>
                  <div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      isPassing
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {isPassing ? '✓ Pass' : '✗ Fail'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Formulas */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Calculation Formulas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-lg">📊</span>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">SGPA Formula</h3>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 font-mono text-sm text-center text-gray-700 dark:text-gray-300">
              SGPA = Σ(Credit × Grade Point) / Σ(Credits)
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sum of credit points divided by total credits for a single semester.</p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-lg">📈</span>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">CGPA Formula</h3>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 font-mono text-sm text-center text-gray-700 dark:text-gray-300">
              CGPA = Σ(Ci × gi) / Σ(Ci)
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Weighted average across all semesters. Failed subjects (grade point &lt; 4) are excluded.</p>
          </div>
        </div>
      </motion.section>

      {/* Important Rules */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Important RTU Rules</h2>
        <div className="space-y-3">
          {[
            { icon: '⚠️', text: 'Grade point below 4 (Grade F) is considered a Fail and excluded from CGPA.', color: 'amber' },
            { icon: '📐', text: 'CGPA uses weighted credit formula, NOT simple average of SGPAs.', color: 'indigo' },
            { icon: '🎯', text: 'Minimum grade point to pass a subject is 4 (Grade E).', color: 'emerald' },
            { icon: '📊', text: 'SGPA is calculated per semester using credit × grade point formula.', color: 'purple' },
          ].map((rule, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
              <span className="text-xl mt-0.5">{rule.icon}</span>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rule.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
