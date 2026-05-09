export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">R</div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">RTU Calculator</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Built for RTU students &bull; Not officially affiliated with Rajasthan Technical University
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} RTU CGPA Calculator</p>
        </div>
      </div>
    </footer>
  );
}
