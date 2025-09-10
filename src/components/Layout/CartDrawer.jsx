import React, { useEffect, useRef } from "react";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleDrawer }) => {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
  toggleDrawer(false);
  if (!user) {
    navigate("/login?redirect=/checkout");
  } else {
    navigate("/checkout");
  }
};


  const handleClickOutside = (event) => {
    if (drawerOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
      toggleDrawer();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-96 md:w-1/3 
        bg-gradient-to-b from-[#29221C] to-[#0D0D0D] 
        shadow-2xl transition-transform ease-in-out duration-300 
        flex flex-col  ${
          drawerOpen
            ? "translate-x-0 border-2 border-[#eacd89]/30 md:mr-0 mr-10 z-50"
            : "translate-x-full mr-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#eacd89]/30">
          <h2 className="text-lg text-[#eacd89] font-semibold tracking-wide">Cart Items</h2>
          <button
            onClick={toggleDrawer}
            className="text-[#eacd89] hover:text-white transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/1828/1828778.png"
              alt="close"
              className="w-5 h-5 invert"
            />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {cart?.products?.length > 0 ? (
            <CartContent
              cart={cart}
              guestId={guestId}
              userId={userId}
              onClose={() => toggleDrawer(false)} // close drawer on click
            />
          ) : (
            <p className="text-[#eacd89] text-sm text-center py-36">Your cart is empty 🛒</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t w-full border-[#eacd89]/30 bg-[#1a1410]">
          {cart?.products?.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#eacd89] to-[#d4af37] 
                hover:from-[#d4af37] hover:to-[#eacd89] transition-all 
                duration-300 text-black font-semibold py-2 rounded-full shadow-lg"
              >
                Checkout
              </button>
              <p className="text-xs text-[#eacd89] mt-2 text-center">
                🔒 Your payment is 100% secure with SSL encryption.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
