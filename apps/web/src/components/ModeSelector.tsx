import { Link, useRouterState } from "@tanstack/react-router";
import { useAuthCtx } from "../common/auth";

export function ModeSelector() {
  const { user } = useAuthCtx();
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;
  const currentMode = location.pathname.split("/")[2] || ""; // Now we need to check the second segment after /app

  const pro = user ? (
    <Link
      to="/app/board"
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 bg-violet-100 text-violet-700 shadow-sm hover:shadow-md hover:bg-violet-200 border border-violet-200 hover:border-violet-300"
    >
      Board
    </Link>
  ) : // TODO: Re-enable Pro+ feature in the future
  // <Link
  //   to="/app/auth"
  //   className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 bg-violet-100 text-violet-700 shadow-sm hover:shadow-md hover:bg-violet-200 border border-violet-200 hover:border-violet-300"
  // >
  //   Pro+
  // </Link>
  null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-sm border border-gray-200">
          <Link to="/app">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentPath === "/app" || currentMode === ""
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🧶</span>
              Timeline
            </button>
          </Link>

          <Link to="/app/windows">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentMode === "windows"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🐾</span>
              Windows
            </button>
          </Link>

          <Link to="/app/domains">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentMode === "domains"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🏷️</span>
              Domains
            </button>
          </Link>
        </div>
        {pro}
      </div>
    </div>
  );
}
