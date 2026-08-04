import React, { useEffect, useRef } from "react";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { X, ShoppingBag } from "lucide-react";
import emtpycart from "../../assets/emtycart.png";

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
    if (
      drawerOpen &&
      drawerRef.current &&
      !drawerRef.current.contains(event.target)
    ) {
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
          className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-96 md:w-1/3
        bg-[#fcfaf6]
        shadow-2xl transition-transform ease-in-out duration-300
        flex flex-col ${
          drawerOpen
            ? "translate-x-0 border-l border-[#ebdccb] md:mr-0 z-50"
            : "translate-x-full mr-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#ebdccb]/60 bg-white">
          <h2
            className="text-lg text-[#0f0d0b] font-semibold tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Cart Items
          </h2>
          <button
            onClick={toggleDrawer}
            aria-label="Close cart"
            className="text-[#8e8577] hover:text-[#0f0d0b] hover:bg-[#f0ece2] p-1.5 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {cart?.products?.length > 0 ? (
            <CartContent
              cart={cart}
              guestId={guestId}
              userId={userId}
              onClose={() => toggleDrawer(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <img
                src={emtpycart}
                className="w-40 h-40 object-contain opacity-90 mb-4"
                alt="Empty cart"
              />
              <p className="text-[#0f0d0b] text-base font-semibold">
                Your cart is empty
              </p>
              <p className="text-sm text-[#8e8577] mt-1 mb-5">
                Looks like you haven't added anything yet.
              </p>
              <button
                onClick={() => toggleDrawer(false)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a87b32] border-b border-[#a87b32] pb-0.5 hover:text-[#0f0d0b] hover:border-[#0f0d0b] transition"
              >
                <ShoppingBag size={14} /> Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t w-full border-[#ebdccb]/60 bg-white">
          {cart?.products?.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#0f0d0b]
                hover:bg-[#c9973f] transition-all
                duration-300 text-white font-semibold py-3 rounded-full shadow-md"
              >
                Checkout
              </button>
              <p className="text-xs text-[#aba293] mt-2 text-center">
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