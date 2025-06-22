import { PropsWithChildren } from "react";
import { useGeneralCtx } from "../common/general";
import { ModeSelector } from "./ModeSelector";
import { Link } from "@tanstack/react-router";

export const Layout = ({ children }: PropsWithChildren) => {
  const { tabs, isConnected, lastUpdate } = useGeneralCtx();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Tab Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    {tabs.length} open tabs
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </div>
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        {isConnected && tabs.length > 0 && (
          <div className="mb-8">
            <ModeSelector />
          </div>
        )}
        {!isConnected ? (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Getting Started
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Install the Tab Dashboard Chrome extension</li>
              <li>
                Make sure this page is open at https://tab-tangle.web.app/
              </li>
              <li>
                The extension will automatically connect and start sending tab
                data
              </li>
            </ol>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

//   return (

//   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//     {/* Modern Header */}
//     <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
//               <svg
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                 />
//               </svg>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 Tab Dashboard
//               </h1>
//               <p className="text-sm text-gray-500">{tabs.length} open tabs</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 isConnected
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               {isConnected ? "Connected" : "Disconnected"}
//             </div>
//             {lastUpdate && (
//               <span className="text-sm text-gray-500">
//                 Last update: {lastUpdate.toLocaleTimeString()}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
