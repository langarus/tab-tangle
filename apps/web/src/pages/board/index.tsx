import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export const BoardPage = () => {
  return (
    <div style={{ height: "80vh", width: "100%" }}>
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
