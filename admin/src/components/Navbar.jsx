import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Film, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex border-r border-gray-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider text-red-500">CINE<span className="text-white">ADMIN</span></h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-8">
        <NavLink to="/" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-red-600" : "hover:bg-gray-800"}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/add-movie" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-red-600" : "hover:bg-gray-800"}`}>
          <PlusCircle size={20} /> Add Movie
        </NavLink>
        <NavLink to="/inventory" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-red-600" : "hover:bg-gray-800"}`}>
          <Film size={20} /> Inventory
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
