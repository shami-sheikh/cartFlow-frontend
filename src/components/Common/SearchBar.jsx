import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductByFilters, setFilters } from "../../redux/slices/productSlice";
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({search: searchTerm}));
    dispatch(fetchProductByFilters({search: searchTerm}));
    navigate(`/collections/all/?search=${encodeURIComponent(searchTerm)}`);
    setIsOpen(false);
    setSearchTerm("")
  };

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-focus and select input when search bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  return (
    <div>
      {isOpen ? (
        <form ref={searchRef} onClick={handleClickOutside} onSubmit={handleSearchSubmit}>
          <div
            className={`
              absolute md:relative flex items-center -mt-2 justify-center md:left-0 left-2 md:right-0 right-4 pr-4 md:top-0 top-4  
              w-full transition-all duration-300 z-50
              sm:w-72
            `}
          >
            {/* Search Icon */}
            <img
              src="https://cdn-icons-png.flaticon.com/128/428/428094.png"
              alt="search"
              className="absolute left-3 w-4 h-4 opacity-70"
            />

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="pl-9 pr-9 py-2 w-full rounded-full
                         border border-[#eacd89]/40
                         bg-gradient-to-r from-[#1a1410] to-[#0d0d0d]
                         text-[#eacd89]
                         placeholder-gray-400
                         shadow-md focus:ring-2 focus:ring-[#eacd89] hover:border-[#eacd89]
                         outline-none transition-all duration-300"
            />

            {/* Close Icon */}
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-5 w-5 h-5 flex mr-2 items-center justify-center text-gray-400 hover:text-[#eacd89] transition-colors"
            >
              <AiOutlineClose className="w-4 h-4 " />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleToggle}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#29221C] transition-colors relative group"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/428/428094.png"
            alt="search"
            className="w-5 h-5 opacity-80"
          />
          <span className="absolute left-1/2 -bottom-3 font-semibold -translate-x-1/2 text-xs text-[#eacd89] opacity-0 group-hover:opacity-100 transition-opacity">
            Search
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
