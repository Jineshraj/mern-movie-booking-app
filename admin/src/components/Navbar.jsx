import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Film, List, Calendar, Ticket, Menu } from "lucide-react";

export default function Navbar({ open, close }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape" && close) close();
    };
    
    // Auto-cleanup stale dropdown renders returning upwards towards Desktop
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const NavItem = ({ to, Icon, label, end = false, onClick }) => (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) =>
      `flex items-center gap-2 text-sm font-bold tracking-wide transition-colors ${isActive ? "text-red-500" : "text-gray-400 hover:text-white"}`
    }>
      {({ isActive }) => (
        <>
          <Icon className={`w-5 h-5 ${isActive ? "text-red-500" : "text-gray-500"}`} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <nav className="w-full bg-black/90 p-4 border-b border-white/10 relative z-50">
      <div className="flex justify-between items-center">
        <div className="text-red-600 font-bold text-xl tracking-widest font-cinzel">ADMIN PANEL</div>
        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
           <NavItem to="/add" Icon={Film} label="ADD MOVIES" />
           <NavItem to="/list" Icon={List} label="LIST MOVIES" />
           <NavItem to="/" Icon={Calendar} label="DASHBOARD" end />
           <NavItem to="/bookings" Icon={Ticket} label="BOOKINGS" />
        </div>
        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-red-500 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>
      </div>
      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 bg-[#111] p-4 rounded-xl border border-white/10 absolute left-4 right-4 shadow-xl">
           <NavItem to="/add" Icon={Film} label="ADD MOVIES" onClick={() => setIsOpen(false)} />
           <NavItem to="/list" Icon={List} label="LIST MOVIES" onClick={() => setIsOpen(false)} />
           <NavItem to="/" Icon={Calendar} label="DASHBOARD" onClick={() => setIsOpen(false)} end />
           <NavItem to="/bookings" Icon={Ticket} label="BOOKINGS" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </nav>
  );
}
