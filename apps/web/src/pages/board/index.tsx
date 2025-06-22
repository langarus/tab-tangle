import {
  Excalidraw,
  convertToExcalidrawElements,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useGeneralCtx } from "../../common/general";
import { useMemo } from "react";
import { TabInfo } from "../../types";

// Helper function to get domain from URL
const getDomainFromUrl = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number = 30) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Convert tabs to Excalidraw element skeletons
const createTabElementSkeletons = (tabs: TabInfo[]) => {
  const cardWidth = 280;
  const cardHeight = 90;
  const padding = 20;
  const cols = 3; // 3 cards per row

  const elements: any[] = [];

  tabs.forEach((tab, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (cardWidth + padding) + 50;
    const y = row * (cardHeight + padding) + 50;

    // Create rectangle background for the tab card
    elements.push({
      type: "rectangle",
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      strokeColor: "#1e40af",
      strokeWidth: 2,
      link: tab.url || null,
      roundness: { type: 3 },
    });

    // Create title text (truncated)
    elements.push({
      type: "text",
      x: x + 15,
      y: y + 20,
      text: truncateText(tab.title || "Untitled Tab"),
      fontSize: 16,
      strokeColor: "#1f2937",
    });

    // Create domain/URL text
    elements.push({
      type: "text",
      x: x + 15,
      y: y + 55,
      text: tab.url ? getDomainFromUrl(tab.url) : "",
      fontSize: 12,
      strokeColor: "#6b7280",
    });
  });

  return elements;
};

export const BoardPage = () => {
  const { selectedTabs } = useGeneralCtx();
  // Convert selected tabs to Excalidraw elements
  const tabElements = useMemo(() => {
    if (selectedTabs.length === 0) return [];

    const skeletons = createTabElementSkeletons(selectedTabs);
    return convertToExcalidrawElements(skeletons);
  }, [selectedTabs]);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <Excalidraw
        initialData={{
          elements: tabElements,
          appState: {
            viewBackgroundColor: "#ffffff",
          },
        }}
        theme="light"
      />
    </div>
  );
};
