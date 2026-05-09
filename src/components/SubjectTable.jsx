import { motion } from 'framer-motion';
import { gradeList, getGradePoint, isPassingGrade } from '../utils/gradeMap';

export default function SubjectTable({ subjects, grades, onGradeChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 shadow-sm" id="subject-table">
      {/* Header - desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        <div className="col-span-1">#</div>
        <div className="col-span-2">Code</div>
        <div className="col-span-4">Subject</div>
        <div className="col-span-1 text-center">Credits</div>
        <div className="col-span-2 text-center">Grade</div>
        <div className="col-span-2 text-center">Points</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {subjects.map((subject, index) => {
          const grade = grades[subject.code] || '';
          const gradePoint = getGradePoint(grade);
          const creditPoints = grade ? subject.credits * gradePoint : 0;
          const isFail = grade && !isPassingGrade(grade);

          return (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              className={`group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20 ${
                isFail ? 'bg-red-50/50 dark:bg-red-900/10' : ''
              }`}
            >
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                <div className="col-span-1 text-sm font-medium text-gray-400 dark:text-gray-500">
                  {index + 1}
                </div>
                <div className="col-span-2">
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-mono font-semibold text-gray-600 dark:text-gray-300">
                    {subject.code}
                  </span>
                </div>
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{subject.name}</p>
                </div>
                <div className="col-span-1 text-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    {subject.credits}
                  </span>
                </div>
                <div className="col-span-2 text-center">
                  <select
                    id={`grade-${subject.code}`}
                    value={grade}
                    onChange={(e) => onGradeChange(subject.code, e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer appearance-none bg-no-repeat bg-right-3 ${
                      grade
                        ? isFail
                          ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 focus:ring-red-500'
                          : 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 focus:ring-emerald-500'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundSize: '20px', backgroundPosition: 'right 8px center' }}
                  >
                    <option value="">Select</option>
                    {gradeList.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 text-center">
                  <motion.span
                    key={creditPoints}
                    initial={{ scale: 1.3, color: '#6366f1' }}
                    animate={{ scale: 1, color: undefined }}
                    className={`text-sm font-bold ${
                      isFail ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {grade ? creditPoints.toFixed(1) : '—'}
                  </motion.span>
                </div>
              </div>

              {/* Mobile card */}
              <div className="md:hidden px-4 py-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">#{index + 1}</span>
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-mono font-semibold text-gray-600 dark:text-gray-300">
                        {subject.code}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{subject.name}</p>
                  </div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-sm font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                    {subject.credits}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={grade}
                    onChange={(e) => onGradeChange(subject.code, e.target.value)}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer appearance-none ${
                      grade
                        ? isFail
                          ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          : 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundSize: '20px', backgroundPosition: 'right 8px center', paddingRight: '32px' }}
                  >
                    <option value="">Select Grade</option>
                    {gradeList.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <div className="text-right min-w-[60px]">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Points</p>
                    <p className={`text-sm font-bold ${
                      isFail ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {grade ? creditPoints.toFixed(1) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
