import { TabInfo } from "../../types";
import { TabCard } from "../../components/TabCard";
import { useGeneralCtx } from "../../common/general";
import g1Url from "../../assets/svg/general/g_1.svg?url";
import g2Url from "../../assets/svg/general/g_2.svg?url";
import g3Url from "../../assets/svg/general/g_3.svg?url";
import g4Url from "../../assets/svg/general/g_4.svg?url";
import g5Url from "../../assets/svg/general/g_5.svg?url";
import g6Url from "../../assets/svg/general/g_6.svg?url";

// List of fun cat names
const catNames = [
  "Whiskers",
  "Luna",
  "Oliver",
  "Bella",
  "Charlie",
  "Lily",
  "Max",
  "Sophie",
  "Jack",
  "Chloe",
  "Simba",
  "Mia",
  "Tiger",
  "Zoe",
  "Shadow",
  "Grace",
  "Felix",
  "Ruby",
  "Smokey",
  "Emma",
  "Mittens",
  "Ava",
  "Oreo",
  "Isabella",
  "Ginger",
  "Mia",
  "Patches",
  "Lily",
  "Boots",
  "Penelope",
];

// Array of all available general SVG icons
const generalIcons = [g1Url, g2Url, g3Url, g4Url, g5Url, g6Url];

export function Windows() {
  const { tabs, handleClose, handleCloseGroup } = useGeneralCtx();
  // Keep a mapping of windowId to generated name
  const windowNames: Record<string, string> = {};
  const usedNames = new Set<string>();
  const nameCounts: Record<string, number> = {};

  // Icon assignment state
  const windowIcons: Record<string, string> = {};
  const availableIcons = [...generalIcons];
  let iconIndex = 0;

  function getUniqueCatName(windowId: string) {
    // Try to assign an unused name
    for (const catName of catNames) {
      if (!usedNames.has(catName)) {
        usedNames.add(catName);
        windowNames[windowId] = catName;
        return catName;
      }
    }
    // If all names are used, append a number
    const base = catNames[parseInt(windowId, 10) % catNames.length] || "";
    nameCounts[base] = (nameCounts[base] ?? 1) + 1;
    const uniqueName = `${base} ${nameCounts[base]}`;
    windowNames[windowId] = uniqueName;
    return uniqueName;
  }

  function getIconForWindow(windowId: string) {
    // Return existing icon if already assigned
    if (windowIcons[windowId]) {
      return windowIcons[windowId];
    }

    // Assign the next icon in rotation
    const icon = availableIcons[iconIndex % availableIcons.length];
    if (icon) {
      windowIcons[windowId] = icon;
      iconIndex++;
    }
    return icon;
  }

  const groupedTabs = tabs.reduce(
    (acc, tab) => {
      const windowId = tab.windowId;
      if (windowId && !acc[windowId]) acc[windowId] = [];
      if (windowId) acc?.[windowId]?.push(tab);
      return acc;
    },
    {} as Record<number, TabInfo[]>,
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedTabs).map(([windowIdStr, windowTabs]) => {
        if (!windowTabs || windowTabs.length === 0) return null;
        // Generate or reuse a unique name for this window
        const windowName =
          windowNames[windowIdStr] || getUniqueCatName(windowIdStr);
        const windowIcon = getIconForWindow(windowIdStr);
        return (
          <div
            key={windowIdStr}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm"> */}
                  <img
                    src={windowIcon}
                    alt={`${windowName} icon`}
                    className="h-10 w-10"
                  />
                  {/* </div> */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {windowName} Window
                    </h2>
                    <p className="text-sm text-gray-600">
                      {windowTabs.length}{" "}
                      {windowTabs.length === 1 ? "tab" : "tabs"}
                    </p>
                  </div>
                </div>
                <button
                  title="Close all tabs in this window"
                  onClick={(e) => handleCloseGroup(windowTabs, e)}
                  className="h-8 w-8 rounded-lg bg-white/80 hover:bg-red-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-200 hover:shadow-sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                {windowTabs.map((tab) => (
                  <div key={tab.id} className="animate-fade-in">
                    <TabCard tab={tab} onClose={handleClose} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
