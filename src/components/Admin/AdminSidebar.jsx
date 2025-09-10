import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBoxOpen, FaClipboard, FaShoppingBag } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../../../Backend/controller/cartController";
import { clearCartAsync } from "../../redux/slices/cartSlice";

const AdminSidebar = ({closeSidebar}) => {
  const navigate = useNavigate()
  const dispatch  = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    dispatch(clearCartAsync())
    navigate("/")
    closeSidebar()
  }
  const handleAdmin = () => {
    navigate("/admin")
  }
  return (
    <div className="p-6 bg-black min-h-screen text-gray-300">
      {/* Logo */}
      <div className="mb-8 text-start">
        <Link
          className="font-Lora text-luxury font-bold opacity-90 text-xl tracking-wide"
          to="/"
        >
          CartFlow
        </Link>
        <h2 onClick={handleAdmin} className="text-lg cursor-pointer font-semibold text-center text-yellow-300 mt-2">
          Admin Dashboard
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2">
        <NavLink onClick={closeSidebar}
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
              isActive
                ? "bg-yellow-300 text-black font-semibold"
                : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800"
            }`
          }
        >
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink onClick={closeSidebar}
          to="/admin/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
              isActive
                ? "bg-yellow-300 text-black font-semibold"
                : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800"
            }`
          }
        >
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>

        <NavLink onClick={closeSidebar}
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
              isActive
                ? "bg-yellow-300 text-black font-semibold"
                : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800"
            }`
          }
        >
          <FaClipboard />
          <span>Orders</span>
        </NavLink>

        <NavLink onClick={closeSidebar}
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
              isActive
                ? "bg-yellow-300 text-black font-semibold"
                : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800"
            }`
          }
        >
          <FaShoppingBag />
          <span>Shop</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-8">
        <button onClick={handleLogout} className="w-full px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 flex items-center justify-center text-white gap-2 transition-colors duration-300">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
