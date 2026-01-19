import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Whiteboard";
import ModalManager from "./utils/ModalManager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<>Hello fren</>} />
      </Routes>

      {/* so modals work on all pages */}
      <ModalManager />
    </BrowserRouter>
  );
}

export default App;
