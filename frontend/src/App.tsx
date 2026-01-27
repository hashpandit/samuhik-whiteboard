import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Whiteboard";
import ModalManager from "./utils/ModalManager";
import Room from "./components/Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>

      {/* so modals work on all pages */}
      <ModalManager />
    </BrowserRouter>
  );
}

export default App;
