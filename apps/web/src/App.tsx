import { Notification } from "./components/Notification";
import { useGeneralCtx } from "./common/general";

function App() {
  const { notification, handleUndo } = useGeneralCtx();
  return (
    <div>
      <div className="container mx-auto px-6 py-8">{/* Content Area */}</div>

      <Notification notification={notification} onUndo={handleUndo} />
    </div>
  );
}

export default App;
