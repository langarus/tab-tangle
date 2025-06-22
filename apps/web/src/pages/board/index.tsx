import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export const BoardPage = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        initialData={{
          elements: [],
          appState: {
            viewBackgroundColor: "#ffffff",
          },
        }}
        theme="light"
      />
    </div>
  );
};
