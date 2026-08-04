import { useState } from "react";
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
    <div className="min-h-screen flex flex-col md:flex-row relative bg-[#fcfaf6]">
      {/* Mobile navbar with toggle */}
      <div className="flex md:hidden p-4 z-20 shadow-sm bg-white border-b border-[#ebdccb]/60 text-[#0f0d0b]">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
          className="block p-2 rounded-full hover:bg-[#fcfaf6] transition-colors duration-300 text-[#5c5548] hover:text-[#0f0d0b]"
        >
          <AlignRight className="w-6 h-6" />
        </button>
        <h1
          onClick={() => navigate("/admin")}
          className="ml-4 text-xl font-medium cursor-pointer"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Admin Dashboard
        </h1>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 w-3/4 max-w-xs h-screen bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <AdminSidebar closeSidebar={toggleSidebar}/>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-white border-r border-[#ebdccb]/60 shrink-0">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-4 md:p-6 overflow-auto bg-[#fcfaf6]">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;