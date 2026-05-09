import { motion } from 'framer-motion';

export default function BranchSelector({ branches, selectedBranch, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="branch-selector">
      {branches.map((branch, index) => {
        const isSelected = selectedBranch === branch.id;
        return (
          <motion.button
            key={branch.id}
            id={`branch-${branch.id.toLowerCase()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(branch.id)}
            className={`relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 border-2 ${
              isSelected
                ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 shadow-lg shadow-indigo-500/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
            }`}
          >
            {/* Glow effect */}
            {isSelected && (
              <motion.div
                layoutId="branch-glow"
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-colors ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}>
                  {branch.id === 'EIC' ? '⚡' : '📡'}
                </div>
                <div>
                  <h3 className={`text-lg font-bold transition-colors ${
                    isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {branch.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{branch.fullName}</p>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white text-xs">✓</span>
                  Selected
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
