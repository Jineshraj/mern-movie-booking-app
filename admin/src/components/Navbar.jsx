import { NavLink } from "react-router-dom";
import { LayoutDashboard, Film, BookOpen, LogOut, Clapperboard } from "lucide-react";

const NAV = [
  { to: "/",          label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Film },
  { to: "/bookings",  label: "Bookings",  icon: BookOpen },
];

const linkBase =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200";
const linkActive = "bg-red-600/20 text-red-400 border border-red-600/30";
const linkIdle   = "text-gray-400 hover:bg-white/5 hover:text-white";

export default function Navbar() {
  const handleLogout = () => {
    ["admin_token", "admin_email", "admin_auth"].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.href = "/";
  };

  return (
    <aside
      className="flex flex-col w-64 min-h-screen py-8 px-4 border-r"
      style={{
        background: "linear-gradient(180deg,#0f0f1a 0%,#0a0a12 100%)",
        borderColor: "rgba(220,38,38,0.15)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="p-2 rounded-xl bg-red-600/20 border border-red-600/30">
          <Clapperboard size={22} className="text-red-400" />
        </div>
        <div>
          <div className="text-white font-bold tracking-wider text-base"
            style={{ fontFamily: "'Cinzel', serif" }}>
            CineVerse
          </div>
          <div className="text-red-500 text-xs font-semibold">ADMIN PANEL</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-600/10 transition-all mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
