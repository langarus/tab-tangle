import { useGeneralCtx } from "../common/general";
import { TabCard } from "./TabCard";

function TabList() {
  const { tabs, handleClose } = useGeneralCtx();
  // Filter out tabs without IDs or URLs - these can't be closed and cause UI issues
  const validTabs = tabs.filter((tab) => tab.id && tab.url);

  if (validTabs.length === 0) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {validTabs.map((tab) => (
        <div key={tab.id} className="animate-fade-in">
          <TabCard tab={tab} onClose={handleClose} />
        </div>
      ))}
    </div>
  );
}

export default TabList;
