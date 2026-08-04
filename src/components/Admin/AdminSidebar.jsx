import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBoxOpen, FaClipboard, FaShoppingBag } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart, clearCartAsync } from "../../redux/slices/cartSlice";

const AdminSidebar = ({closeSidebar}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearCartAsync());
    navigate("/");
    if (closeSidebar) closeSidebar();
  };

  const handleAdmin = () => {
    navigate("/admin");
    if (closeSidebar) closeSidebar();
  };

  return (
    <div className="p-6 bg-white min-h-screen text-[#0f0d0b] flex flex-col">
      {/* Logo */}
      <div className="mb-10 mt-2 text-center md:text-left">
        <Link
          className="font-semibold text-[#0f0d0b] text-2xl tracking-wide"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          to="/"
        >
          CartFlow
        </Link>
        <h2
          onClick={handleAdmin}
          className="text-sm cursor-pointer font-medium text-[#8e8577] mt-1 uppercase tracking-widest hover:text-[#c9973f] transition-colors"
        >
          Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavLink
          onClick={closeSidebar}
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-[#fcfaf6] text-[#a87b32] font-semibold border border-[#ebdccb]/60 shadow-sm"
                : "text-[#5c5548] hover:text-[#0f0d0b] hover:bg-[#fcfaf6] border border-transparent"
            }`
          }
        >
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/admin/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-[#fcfaf6] text-[#a87b32] font-semibold border border-[#ebdccb]/60 shadow-sm"
                : "text-[#5c5548] hover:text-[#0f0d0b] hover:bg-[#fcfaf6] border border-transparent"
            }`
          }
        >
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-[#fcfaf6] text-[#a87b32] font-semibold border border-[#ebdccb]/60 shadow-sm"
                : "text-[#5c5548] hover:text-[#0f0d0b] hover:bg-[#fcfaf6] border border-transparent"
            }`
          }
        >
          <FaClipboard />
          <span>Orders</span>
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-[#fcfaf6] text-[#a87b32] font-semibold border border-[#ebdccb]/60 shadow-sm"
                : "text-[#5c5548] hover:text-[#0f0d0b] hover:bg-[#fcfaf6] border border-transparent"
            }`
          }
        >
          <FaShoppingBag />
          <span>Shop</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto mb-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 flex items-center justify-center text-red-500 font-medium gap-2 transition-colors duration-300"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;