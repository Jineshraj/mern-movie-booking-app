import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ListMoviesPage from "./pages/ListMoviesPage";
import AddPage from "./pages/AddPage";
import Bookings from "./pages/Bookings";
import AdminLogin from "./pages/Login";

// Auth guard — redirects to /login if no admin_token in localStorage
function RequireAdmin({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#09090f", color: "#fff" }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflowX: "hidden",
          overflowY: "auto",
          padding: "32px 28px",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/list" element={<ListMoviesPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/bookings" element={<Bookings />} />
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
