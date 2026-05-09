import { motion } from 'framer-motion';

export default function ResultCard({ title, value, subtitle, icon, color = 'indigo', delay = 0 }) {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-500 to-indigo-600',
      shadow: 'shadow-indigo-500/30',
      light: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      shadow: 'shadow-purple-500/30',
      light: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    },
    emerald: {
      bg: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/30',
      light: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    },
    amber: {
      bg: 'from-amber-500 to-amber-600',
      shadow: 'shadow-amber-500/30',
      light: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    },
    rose: {
      bg: 'from-rose-500 to-rose-600',
      shadow: 'shadow-rose-500/30',
      light: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, type: 'spring', bounce: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Background decoration */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${colors.bg} opacity-5`} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.light} text-lg`}>
            {icon}
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        </div>

        <motion.p
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
          className="text-3xl font-extrabold text-gray-900 dark:text-white font-outfit"
        >
          {value}
        </motion.p>

        {subtitle && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
