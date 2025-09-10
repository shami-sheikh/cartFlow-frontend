import  {  useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { MdClose } from "react-icons/md";
import { AlignRight } from "lucide-react";
import { BsCart4 } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import {  useSelector } from "react-redux";


const Navber = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const {cart} = useSelector((state)=> state.cart)
  const {user , guestId} = useSelector((state)=> state.auth)
  const handleNavToggle = () => setIsNavOpen((prev) => !prev);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
 



  // Single source of truth for links
  const Links = [
    { name: "MEN", path: "/collections/all?gender=Men" },
    { name: "WOMEN", path: "/collections/all?gender=Women" },
    { name: "Top Wear", path: "/collections/all?category=Top Wear" },
    { name: "Bottom Wear", path: "/collections/all?category=Bottom Wear" },
  ];

  // Custom function for category active check
  const isCategoryActive = (category) =>
    new URLSearchParams(location.search).get("category") === category;

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full mx-auto flex justify-between items-center border-b bg-gradient-to-r from-black via-gray-900 to-black text-yellow-400 border-gray-600 px-4 sm:px-6 py-3">
        {/* Left Logo */}
        <Link
          className="font-Lora font-bold opacity-85 text-lg sm:text-xl tracking-wide"
          to="/"
        >
          CartFlow
        </Link>

        {/* Center Links (Desktop only) */}
        <div className="hidden md:flex space-x-4 lg:space-x-6 items-center justify-center">
          {Links.map((link) => {
            // Custom active logic for all links
            const params = new URLSearchParams(location.search);
            let active = false;
            if (link.name === "Top Wear") {
              active = params.get("category") === "Top Wear";
            } else if (link.name === "Bottom Wear") {
              active = params.get("category") === "Bottom Wear";
            } else if (link.name === "MEN") {
              active = params.get("gender") === "Men";
            } else if (link.name === "WOMEN") {
              active = params.get("gender") === "Women";
            } else {
              // fallback to isActive for other links
              // (not needed here, but for future extensibility)
            }
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => {
                  const isLinkActive = active || isActive;
                  return `relative group text-sm lg:text-[15px] font-semibold transition-all duration-300 ease-in-out ${
                    isLinkActive
                      ? "text-yellow-500"
                      : "text-yellow-300 hover:text-yellow-300"
                  }`;
                }}
              >
                {link.name}
                <span
                  className={`absolute h-[2px] left-0 bottom-[-4px] bg-[#D4AF37] transition-all duration-500 ease-in-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </NavLink>
            );
          })}

          {/* Admin button (different style, only large screens) */}
          <NavLink
            to="/admin"
            className="hidden lg:inline-block px-5 py-1.5 text-sm rounded-full border border-[#eacd89] text-[#eacd89] 
              hover:bg-[#eacd89] hover:text-black transition-all duration-300 font-semibold shadow-md"
          >
            Admin
          </NavLink>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-center space-x-2">
          {/* Search - Hidden on mobile to save space */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>

          {/* Profile/Login Link */}
          {user ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `relative group p-1 sm:p-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#eacd89]/20 text-[#eacd89]"
                    : "hover:bg-gray-200/20 text-gray-300 hover:text-[#eacd89]"
                }`
              }
              aria-label="Profile"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover "
                />
              ) : (
                <FaUser className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" />
              )}
              <span className="hidden sm:block absolute left-1/2 -bottom-3 -translate-x-1/2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                Profile
              </span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `relative group p-1 sm:p-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#eacd89]/20 text-[#eacd89]"
                    : "hover:bg-gray-200/20 text-gray-300 hover:text-[#eacd89]"
                }`
              }
              aria-label="Login"
            >
              <FaUser className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden sm:block absolute left-1/2 -bottom-3 -translate-x-1/2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                Login
              </span>
            </NavLink>
          )}

          {/* Cart */}
          <button
            onClick={toggleDrawer}
            aria-label="Open cart"
            className="relative group p-1 sm:p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300 text-gray-300 hover:text-[#eacd89]"
          >
            <BsCart4 className="h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-500 text-white text-[10px] sm:text-xs shadow-md">
              {cart?.products?.length || 0}
            </span>
            <span className="hidden sm:block absolute left-1/2 -bottom-3 -translate-x-1/2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Cart
            </span>
          </button>

          {/* Mobile Search - Only visible on small screens */}
          <div className="sm:hidden">
            <SearchBar />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={handleNavToggle}
            aria-label="Toggle Menu"
            className="md:hidden block p-1 sm:p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300 text-gray-300 hover:text-[#eacd89]"
          >
            <AlignRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      {/* Mobile Navigation Overlay */}
      {isNavOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsNavOpen(false)}
        ></div>
      )}

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed top-0 left-0 w-3/4 max-w-xs h-screen bg-[#1a1714] shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
          isNavOpen
            ? "translate-x-0 border-r-2 border-[#eacd89]"
            : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#eacd89]/40">
          <h2 className="text-lg font-bold text-[#eacd89] tracking-wide">
            CartFlow
          </h2>
          <button
            onClick={handleNavToggle}
            aria-label="Close Menu"
            className="text-gray-400 hover:text-[#eacd89] transition"
          >
            <MdClose
              className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-[#eacd89] rounded-full text-[#eacd89] cursor-pointer 
               transition-all duration-300 hover:bg-[#eacd89]  hover:text-black hover:rotate-90 p-1 shadow-md"
            />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col p-4 space-y-4">
          {Links.concat({ name: "Admin", path: "/admin" }).map((link) => {
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsNavOpen(false)}
                className={({ isActive, location }) => {
                  // Custom active logic for category/gender links
                  const params = new URLSearchParams(window.location.search);
                  let active = isActive;
                  if (link.name === "Top Wear") {
                    active = params.get("category") === "Top Wear";
                  } else if (link.name === "Bottom Wear") {
                    active = params.get("category") === "Bottom Wear";
                  } else if (link.name === "MEN") {
                    active = params.get("gender") === "Men";
                  } else if (link.name === "WOMEN") {
                    active = params.get("gender") === "Women";
                  }
                  return `block text-[15px] font-medium transition-all duration-300 ease-in-out rounded-lg px-3 py-2 ${
                    active
                      ? "text-black bg-[#eacd89]"
                      : "text-gray-300 hover:text-[#eacd89] hover:bg-gray-800"
                  }`;
                }}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navber;
