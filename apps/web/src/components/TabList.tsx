import { useRef } from "react";
import { useGeneralCtx } from "../common/general";
import { TabCard } from "./TabCard";
import { DragSelectOverlay } from "./DragSelectOverlay";
import { useDragSelect } from "../hooks/useDragSelect";

function TabList() {
  const { tabs, handleClose, selectedTabs, handleSelectTabs, handleDeselectTabs } = useGeneralCtx();
  // Filter out tabs without IDs or URLs - these can't be closed and cause UI issues
  const validTabs = tabs.filter((tab) => tab.id && tab.url);

  const containerRef = useRef<HTMLDivElement>(null);
  const { selectionRect, isDragging } = useDragSelect({
    containerRef,
    tabs: validTabs,
    selectedTabs,
    handleSelectTabs,
    handleDeselectTabs,
  });

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
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {validTabs.map((tab) => (
        <div key={tab.id} className="animate-fade-in">
          <TabCard tab={tab} onClose={handleClose} />
        </div>
      ))}
      <DragSelectOverlay selectionRect={selectionRect} isDragging={isDragging} />
    </div>
  );
}

export default TabList;
