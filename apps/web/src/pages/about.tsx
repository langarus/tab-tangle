import aboutUsSvg from "../assets/svg/general/aboutus.svg?url";

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <img src={aboutUsSvg} alt="About Tab Tangle" className="w-16 h-16" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About Tab Tangle</h1>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 shadow-sm">
        <div>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg mb-4">
            If you're like me, all over the place with tabs, this helps you
            manage the mess. That's it. Your data stays on your device.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Questions?{" "}
            <a
              href="mailto:tab-tangle@proton.me"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
            >
              tab-tangle@proton.me
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
