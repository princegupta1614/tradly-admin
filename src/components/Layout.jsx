import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Users, MessageSquare, LogOut, Menu, X } from "lucide-react";
import API from "../api";
import toast from "react-hot-toast";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await API.post("/logout"); 
    } catch (error) {
        console.log("Backend logout failed");
    } finally {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        toast.success("Logged out successfully");
        navigate("/");
    }
  };

  const navClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
      isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
    }`;

  // Close sidebar on mobile when a link is clicked
  const handleNavClick = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- MOBILE HEADER --- */}
      <header className="lg:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
        
        {/* ✅ Logo Area (Mobile) */}
        <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Tradly Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-extrabold text-indigo-600">Tradly.</h1>
        </div>

        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
        </button>
      </header>

      {/* --- SIDEBAR OVERLAY (Mobile Only) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-6 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex justify-between items-center mb-10">
            
            {/* ✅ Logo Area (Sidebar) */}
            <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Tradly Logo" className="w-10 h-10 object-contain" />
                <h1 className="text-2xl font-extrabold text-indigo-600">Tradly.</h1>
            </div>

            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/dashboard/users" className={navClass} onClick={handleNavClick}>
            <Users size={20} /> Users
          </NavLink>
          <NavLink to="/dashboard/complaints" className={navClass} onClick={handleNavClick}>
            <MessageSquare size={20} /> Complaints
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl mt-auto transition font-medium">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 p-4 md:p-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;