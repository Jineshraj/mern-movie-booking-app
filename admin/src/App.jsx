import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddPage from "./pages/AddPage";
import ListMovie from "./pages/ListMovie";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-movie" element={<AddPage />} />
            <Route path="/inventory" element={<ListMovie />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
