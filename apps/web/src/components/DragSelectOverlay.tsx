interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragSelectOverlayProps {
  selectionRect: SelectionRect | null;
  isDragging: boolean;
}

export function DragSelectOverlay({ selectionRect, isDragging }: DragSelectOverlayProps) {
  if (!isDragging || !selectionRect) return null;

  return (
    <div
      className="fixed border-2 border-blue-400 bg-blue-400/10 rounded-sm pointer-events-none z-50"
      style={{
        left: selectionRect.x,
        top: selectionRect.y,
        width: selectionRect.width,
        height: selectionRect.height,
      }}
    />
  );
}
