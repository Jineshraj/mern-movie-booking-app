import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/ListMovie";
import BookingsAdmin from "./pages/BookingsAdmin";
import AdminLogin from "./pages/Login";

// Auth guard — redirects to /login if no admin_token in localStorage
function RequireAdmin({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#09090f", color: "#fff" }}>
      {/* Fixed 220px left sidebar */}
      <Navbar />

      {/* Main content — offset by sidebar width */}
      <main
        style={{
          marginLeft: "220px",
          flex: 1,
          overflowX: "hidden",
          overflowY: "auto",
          padding: "32px 28px",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/bookings" element={<BookingsAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — login page */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected — everything else requires admin_token */}
        <Route
          path="/*"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
