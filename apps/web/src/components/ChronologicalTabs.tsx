import { TabInfo } from "../types";
import { TabCard } from "./TabCard";
import { useGeneralCtx } from "../common/general";

interface TimeGroup {
  label: string;
  tabs: TabInfo[];
  color: string;
  bgColor: string;
  borderColor: string;
}

function ChronologicalTabs() {
  const { tabs, handleClose, handleCloseGroup } = useGeneralCtx();

  if (tabs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tabs received yet</div>
        <div className="text-gray-500 text-sm">
          Make sure your Chrome extension is running and click "Send Tabs to
          Dashboard"
        </div>
      </div>
    );
  }

  // Group tabs by time periods
  const groupTabsByTime = (tabs: TabInfo[]): TimeGroup[] => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const groups: TimeGroup[] = [
      {
        label: "Last Hour",
        tabs: [],
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      {
        label: "Today",
        tabs: [],
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      {
        label: "This Week",
        tabs: [],
        color: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      },
      {
        label: "This Month",
        tabs: [],
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      {
        label: "Older",
        tabs: [],
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    ];

    // Log the first tab for debugging

    tabs.forEach((tab) => {
      // If lastAccessed is not available or is 0, treat it as very recent
      const lastAccessed =
        tab.lastAccessed && tab.lastAccessed > 0 ? tab.lastAccessed : now;
      const timeDiff = now - lastAccessed;

      if (timeDiff <= oneHour) {
        groups[0]?.tabs.push(tab);
      } else if (timeDiff <= oneDay) {
        groups[1]?.tabs.push(tab);
      } else if (timeDiff <= oneWeek) {
        groups[2]?.tabs.push(tab);
      } else if (timeDiff <= oneMonth) {
        groups[3]?.tabs.push(tab);
      } else {
        groups[4]?.tabs.push(tab);
      }
    });

    // Sort tabs within each group by lastAccessed (newest first)
    groups.forEach((group) => {
      group.tabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
    });

    // Return only groups that have tabs
    return groups.filter((group) => group.tabs.length > 0);
  };

  const timeGroups = groupTabsByTime(tabs);

  // Format time ago
  const formatTimeAgo = (lastAccessed: number): string => {
    const now = Date.now();
    const diff = now - lastAccessed;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {timeGroups.map((group) => (
        <div
          key={group.label}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div
            className={`${group.bgColor} px-4 py-3 border-b ${group.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div
                  className={`h-8 w-8 ${group.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <svg
                    className={`h-4 w-4 ${group.color}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-lg font-semibold ${group.color} truncate`}
                  >
                    {group.label}
                  </h2>
                  <p className={`text-sm ${group.color} opacity-75`}>
                    {group.tabs.length}{" "}
                    {group.tabs.length === 1 ? "tab" : "tabs"}
                  </p>
                </div>
              </div>
              <button
                title={`Close all tabs in ${group.label.toLowerCase()}`}
                onClick={(e) => handleCloseGroup(group.tabs, e)}
                className="h-8 w-8 rounded-lg bg-white/80 hover:bg-red-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-200 hover:shadow-sm flex-shrink-0 ml-2"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-1">
              {group.tabs.map((tab) => (
                <div key={tab.id} className="animate-fade-in">
                  <TabCard tab={tab} onClose={handleClose} />
                  {tab.lastAccessed && (
                    <div className="px-3 pb-2 text-xs text-gray-500 text-center">
                      {formatTimeAgo(tab.lastAccessed)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChronologicalTabs;
