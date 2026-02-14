import { useEffect, useRef, useState, useCallback, RefObject } from "react";
import { TabInfo } from "../types";

interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseDragSelectOptions {
  containerRef: RefObject<HTMLElement | null>;
  tabs: TabInfo[];
  selectedTabs: TabInfo[];
  handleSelectTabs: (tabs: TabInfo[]) => void;
  handleDeselectTabs: (tabs: TabInfo[]) => void;
}

const MIN_DRAG_DISTANCE = 5;

// Elements that should not initiate a drag (close/checkbox buttons, form inputs, links)
const NO_DRAG_SELECTORS = "[data-no-drag], input, select, textarea, a[href]";

function rectsIntersect(
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function useDragSelect({
  containerRef,
  tabs,
  selectedTabs,
  handleSelectTabs,
  handleDeselectTabs,
}: UseDragSelectOptions) {
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const dragActivated = useRef(false);
  const preExistingSelection = useRef<Set<number>>(new Set());
  const currentDragSelection = useRef<Set<number>>(new Set());

  const getIntersectingTabIds = useCallback(
    (rect: SelectionRect): Set<number> => {
      const result = new Set<number>();
      const selRect = {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height,
      };

      const container = containerRef.current;
      if (!container) return result;

      const tabElements = container.querySelectorAll<HTMLElement>("[data-tab-id]");
      tabElements.forEach((el) => {
        const tabId = parseInt(el.dataset.tabId || "", 10);
        if (isNaN(tabId)) return;

        const elRect = el.getBoundingClientRect();
        if (
          rectsIntersect(selRect, {
            left: elRect.left,
            top: elRect.top,
            right: elRect.right,
            bottom: elRect.bottom,
          })
        ) {
          result.add(tabId);
        }
      });

      return result;
    },
    [containerRef],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // Only left mouse button
      if (e.button !== 0) return;

      // Don't start drag on elements explicitly marked as no-drag (close/checkbox buttons)
      const target = e.target as HTMLElement;
      if (target.closest(NO_DRAG_SELECTORS)) return;

      // Prevent text selection immediately on mousedown
      e.preventDefault();

      startPoint.current = { x: e.clientX, y: e.clientY };
      dragActivated.current = false;

      // Snapshot which tabs are already selected before this drag
      preExistingSelection.current = new Set(
        selectedTabs.filter((t) => t.id != null).map((t) => t.id!),
      );
      currentDragSelection.current = new Set();
    },
    [selectedTabs],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!startPoint.current) return;

      const dx = e.clientX - startPoint.current.x;
      const dy = e.clientY - startPoint.current.y;

      // Check minimum drag distance
      if (!dragActivated.current) {
        if (Math.abs(dx) < MIN_DRAG_DISTANCE && Math.abs(dy) < MIN_DRAG_DISTANCE) {
          return;
        }
        dragActivated.current = true;
        setIsDragging(true);
      }

      const rect: SelectionRect = {
        x: Math.min(e.clientX, startPoint.current.x),
        y: Math.min(e.clientY, startPoint.current.y),
        width: Math.abs(dx),
        height: Math.abs(dy),
      };
      setSelectionRect(rect);

      // Find tabs intersecting the rectangle
      const intersecting = getIntersectingTabIds(rect);

      // Determine which tabs to select/deselect compared to previous drag state.
      // Toggle logic: dragging over a selected tab deselects it, over an unselected
      // tab selects it. When the rectangle moves away, restore pre-drag state.
      const prevDragSet = currentDragSelection.current;
      const preExisting = preExistingSelection.current;

      const toSelect: TabInfo[] = [];
      const toDeselect: TabInfo[] = [];

      // Tabs newly entering the rectangle
      intersecting.forEach((id) => {
        if (prevDragSet.has(id)) return; // already handled
        const tab = tabs.find((t) => t.id === id);
        if (!tab) return;
        if (preExisting.has(id)) {
          // Was selected before drag → toggle OFF
          toDeselect.push(tab);
        } else {
          // Was not selected → toggle ON
          toSelect.push(tab);
        }
      });

      // Tabs leaving the rectangle → restore to pre-drag state
      prevDragSet.forEach((id) => {
        if (intersecting.has(id)) return; // still in rect
        const tab = tabs.find((t) => t.id === id);
        if (!tab) return;
        if (preExisting.has(id)) {
          // Was selected before drag, we toggled it off, now restore → select
          toSelect.push(tab);
        } else {
          // Was not selected, we toggled it on, now restore → deselect
          toDeselect.push(tab);
        }
      });

      if (toSelect.length > 0) handleSelectTabs(toSelect);
      if (toDeselect.length > 0) handleDeselectTabs(toDeselect);

      currentDragSelection.current = intersecting;
    },
    [tabs, getIntersectingTabIds, handleSelectTabs, handleDeselectTabs],
  );

  // After a drag, suppress the click event that browsers fire after mouseup
  // so tab cards don't navigate/toggle when the user was just drag-selecting.
  const justDragged = useRef(false);

  const handleClickCapture = useCallback((e: MouseEvent) => {
    if (justDragged.current) {
      e.stopPropagation();
      e.preventDefault();
      justDragged.current = false;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!startPoint.current) return;

    if (dragActivated.current) {
      justDragged.current = true;
    }

    startPoint.current = null;
    dragActivated.current = false;
    setSelectionRect(null);
    setIsDragging(false);
    currentDragSelection.current = new Set();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDragging) {
        // Cancel drag — revert all toggles back to pre-drag state
        const toDeselect: TabInfo[] = [];
        const toSelect: TabInfo[] = [];
        currentDragSelection.current.forEach((id) => {
          const tab = tabs.find((t) => t.id === id);
          if (!tab) return;
          if (preExistingSelection.current.has(id)) {
            // Was selected, we toggled it off → restore by selecting
            toSelect.push(tab);
          } else {
            // Was not selected, we toggled it on → restore by deselecting
            toDeselect.push(tab);
          }
        });
        if (toSelect.length > 0) handleSelectTabs(toSelect);
        if (toDeselect.length > 0) handleDeselectTabs(toDeselect);

        startPoint.current = null;
        dragActivated.current = false;
        setSelectionRect(null);
        setIsDragging(false);
      }
    },
    [isDragging, tabs, handleSelectTabs, handleDeselectTabs],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Listen on window so drag can start from anywhere on the page
    window.addEventListener("mousedown", handleMouseDown);
    // Capture-phase click handler to swallow clicks after a drag
    window.addEventListener("click", handleClickCapture, true);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("click", handleClickCapture, true);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, handleMouseDown, handleClickCapture, handleMouseMove, handleMouseUp, handleKeyDown]);

  return { selectionRect, isDragging };
}
