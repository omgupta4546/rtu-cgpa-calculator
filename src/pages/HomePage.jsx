import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '📊', title: 'SGPA Calculator', desc: 'Calculate semester SGPA (1st, 2nd, 3rd) with official RTU formula', link: '/sgpa', color: 'from-indigo-500 to-blue-600' },
  { icon: '📈', title: 'CGPA Calculator', desc: 'Weighted CGPA calculation up to 4th semester', link: '/cgpa', color: 'from-purple-500 to-pink-600' },
  { icon: 'ℹ️', title: 'RTU Grading', desc: 'Learn about RTU official grading system', link: '/about', color: 'from-emerald-500 to-teal-600' },
];

const stats = [
  { label: 'Branches', value: '2', icon: '🏛️' },
  { label: 'Semesters', value: '4', icon: '📅' },
  { label: 'Subjects', value: '32', icon: '📚' },
  { label: 'Free Forever', value: '100%', icon: '💎' },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-4">
            <span>🎓</span> For RTU Students
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit leading-tight">
            <span className="text-gray-900 dark:text-white">RTU SGPA &amp; CGPA</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Calculator</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Calculate your Rajasthan Technical University grades instantly using the official RTU weighted credit formula. Currently supporting EIC &amp; ECE branches.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/sgpa" id="hero-sgpa-btn" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all active:scale-95">
            📊 Calculate SGPA
          </Link>
          <Link to="/cgpa" id="hero-cgpa-btn" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5 transition-all active:scale-95">
            📈 Calculate CGPA
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-center p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white font-outfit mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.15 }} whileHover={{ y: -6 }}>
            <Link to={f.link} className="block group p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:shadow-xl transition-all h-full">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white text-xl shadow-lg mb-4`}>{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-4 group-hover:gap-2 transition-all">
                Get Started <span>→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Supported Branches */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">Supported Branches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            { id: 'EIC', name: 'Electronics Instrumentation & Control', icon: '⚡' },
            { id: 'ECE', name: 'Electronics & Communication Engineering', icon: '📡' },
          ].map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
              <span className="text-3xl">{b.icon}</span>
              <div className="text-left">
                <p className="font-bold text-gray-800 dark:text-gray-200">{b.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{b.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
