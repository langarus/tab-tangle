import { Link } from "@tanstack/react-router";
import { ThemeSelector } from "../components/ThemeSelector";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/img/favicon.svg"
                alt="Tab Tangle Logo"
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Tab Tangle</h1>
              </div>
            </Link>
            <nav className="flex items-center space-x-4 sm:space-x-6">
              <Link
                to="/app/about"
                className="hidden sm:inline-block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/app/privacy"
                className="hidden sm:inline-block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <ThemeSelector />
              <Link
                to="/app"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="hidden sm:inline">Open Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Tame Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight pb-1">
                Tab Tangle
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Manage, search, and organize your browser tabs with a beautiful
              visual dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#features"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your tabs efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Quick Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Find any tab instantly by searching titles or URLs right from
                the extension popup. No more scrolling through dozens of tabs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Visual Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                See all your tabs organized by window in one beautiful, clean
                interface. Get a bird's-eye view of your browsing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-100 dark:border-green-800 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Bulk Actions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Close multiple tabs at once using the "Close All" feature for
                matching search results. Save time and keep organized.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-100 dark:border-orange-800 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Real-Time Sync
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your dashboard updates automatically as you open and close tabs.
                No manual refresh needed - it just works.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border border-cyan-100 dark:border-cyan-800 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Select Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose specific tabs to close in bulk from the dashboard view.
                Take control of your browsing experience.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-slate-700 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Privacy-First
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All your tab data stays on your device. Nothing is sent to our
                servers. No tracking, no analytics, no data collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Install Extension
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Add Tab Tangle to your browser (Chrome, Firefox, or Edge) from
                the extension store. It's free and takes just seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Open Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Click the extension icon and open the dashboard to see all your
                tabs organized in one beautiful view.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Manage Tabs
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Search, organize, and close tabs efficiently. Your dashboard
                updates in real-time as you browse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Tame Your Tabs?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have taken control of their browsing
            experience.
          </p>
          <div className="mb-8">
            <p className="text-blue-100 text-lg mb-4 font-medium">
              Install Tab Tangle:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://chromewebstore.google.com/detail/tab-tangle/glflinnnffehfcoppoelhapbiclbkaap"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Chrome
              </a>
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/tab-tangle/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Firefox
              </a>
              <a
                href="https://microsoftedge.microsoft.com/addons/detail/tab-tangle/bjodmggncigdnbhhmjpkblmnajhpnlmf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Edge
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/app"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl border border-blue-500 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Open Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <img
                src="/img/favicon.svg"
                alt="Tab Tangle Logo"
                className="h-8 w-8"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Tab Tangle. Tame your tabs.
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                to="/app/about"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/app/privacy"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};
