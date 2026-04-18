import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/ListMovie";
import BookingsAdmin from "./pages/BookingsAdmin";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen" style={{ background: "#0a0a0f", color: "#fff" }}>
        <Navbar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/bookings" element={<BookingsAdmin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
