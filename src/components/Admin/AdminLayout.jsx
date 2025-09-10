import {  useState } from "react";
import { AlignRight } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";


const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile navbar with toggle */}
      <div className="flex md:hidden p-4 z-20 shadow-sm bg-[#1a1714] text-gray-200">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
          className="block p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300 text-gray-200 hover:text-[#eacd89]"
        >
          <AlignRight className="w-6 h-6" />
        </button>
        <h1
          onClick={() => navigate("/admin")}
          className="ml-4 text-xl font-semibold cursor-pointer"
        >
          Admin Dashboard
        </h1>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 w-3/4 max-w-xs h-screen bg-[#1a1714] shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen
            ? "translate-x-0 border-r-2 border-[#eacd89]"
            : "-translate-x-full" 
        }`}
      >
        <AdminSidebar closeSidebar={toggleSidebar}/>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-[#1a1714] border-r border-[#eacd89]">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto bg-gradient-to-r from-[#3f3224] to-[#131111] text-luxury">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
