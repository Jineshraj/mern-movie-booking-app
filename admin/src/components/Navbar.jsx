import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  BookOpen,
  LogOut,
  Clapperboard,
} from "lucide-react";

const NAV = [
  { to: "/",          label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory",  icon: Film },
  { to: "/bookings",  label: "Bookings",   icon: BookOpen },
];

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    window.location.href = "/login";
  };

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        background: "linear-gradient(180deg, #0f0f1a 0%, #0a0a12 100%)",
        borderRight: "1px solid rgba(220,38,38,0.15)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "28px 14px",
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 6px", marginBottom: "36px" }}>
        <div style={{
          background: "rgba(220,38,38,0.15)",
          border: "1px solid rgba(220,38,38,0.3)",
          borderRadius: "10px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Clapperboard size={20} style={{ color: "#f87171" }} />
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: "#fff", fontSize: "15px", letterSpacing: "0.05em" }}>
            CineVerse
          </div>
          <div style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#fff",
            background: "#dc2626",
            padding: "1px 6px",
            borderRadius: "4px",
            display: "inline-block",
            marginTop: "2px",
          }}>
            ADMIN
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.18s",
              background: isActive ? "rgba(220,38,38,0.15)" : "transparent",
              color: isActive ? "#f87171" : "#9ca3af",
              border: isActive ? "1px solid rgba(220,38,38,0.25)" : "1px solid transparent",
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 12px",
          borderRadius: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          color: "#9ca3af",
          width: "100%",
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(220,38,38,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "transparent"; }}
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}
