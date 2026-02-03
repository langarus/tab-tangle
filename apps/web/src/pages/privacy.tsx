import privacySvg from "../assets/svg/general/privacy.svg?url";

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <img src={privacySvg} alt="Privacy Policy" className="w-16 h-16" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
        Last Updated: February 3, 2026
      </p>

      <div className="space-y-8">
        {/* Main message upfront */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🔒</span>
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-blue-900 dark:text-blue-200">
                Your data stays on your device
              </h2>
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-lg">
                Tab Tangle doesn't collect, store, or send any data to servers.
                Everything happens locally in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Simple explanation */}
        <section className="bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-gray-800 rounded-xl p-6 hover:border-blue-200 dark:hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🐾</span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              How it works
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            When you use Tab Tangle, it reads your open tabs to show them in the
            dashboard. This information is only used to display your tabs—it
            never leaves your browser.
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>No data sent to any servers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>No data stored permanently</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>No tracking or analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>No third-party services</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Doesn't run in incognito mode</span>
            </li>
          </ul>
        </section>

        {/* Permissions */}
        <section className="bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-gray-800 rounded-xl p-6 hover:border-blue-200 dark:hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👀</span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Why we need permissions
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Tab Tangle needs to see your tabs to manage them. That's it.
          </p>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
            <li className="flex items-start gap-2">
              <span className="text-lg mt-0.5">🐾</span>
              <div>
                <strong className="text-gray-900 dark:text-white">
                  tabs permission
                </strong>
                : To see what tabs you have open
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg mt-0.5">🐾</span>
              <div>
                <strong className="text-gray-900 dark:text-white">
                  activeTab permission
                </strong>
                : To switch between tabs when you click them
              </div>
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4 text-sm italic">
            We don't request permissions to read page content, browsing history,
            cookies, or anything else.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💬</span>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Questions?
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            If you have any questions about privacy, feel free to reach out:
          </p>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-xl">📧</span>
              <div>
                <strong className="dark:text-white">Email</strong>:{" "}
                <a
                  href="mailto:tab-tangle@proton.me"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
                >
                  tab-tangle@proton.me
                </a>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
