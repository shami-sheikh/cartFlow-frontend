import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  updateCart,
  deleteFromCart,
  clearCart,
  clearCartAsync,
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart, guestId, userId, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = cart?.products || [];

  const increaseQty = (productId, size, color, quantity) => {
    dispatch(
      updateCart({
        productId,
        guestId,
        userId,
        size,
        color,
        quantity: quantity + 1,
      })
    );
  };

  const decreaseQty = (productId, size, color, quantity) => {
    if (quantity > 1) {
      dispatch(
        updateCart({
          productId,
          guestId,
          userId,
          size,
          color,
          quantity: quantity - 1,
        })
      );
    } else {
      removeItem(productId, size, color);
    }
  };

  const removeItem = (productId, size, color) => {
    dispatch(deleteFromCart({ productId, guestId, userId, size, color }));
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the cart?");
    if (confirmClear) {
      dispatch(clearCartAsync({ userId, guestId })); // backend
      dispatch(clearCart()); // redux + localStorage
    }
  };

  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
    if (onClose) onClose();
  };

  return (
    <div>
      {/* Header with Clear Cart */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-lg font-semibold text-[#0f0d0b]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Your Cart
        </h2>
        {cartProducts.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs font-bold uppercase tracking-widest text-[#a87b32] hover:text-[#0f0d0b] transition"
          >
            Clear Cart ✖
          </button>
        )}
      </div>

      {/* Cart Items */}
      {cartProducts.length === 0 ? (
        <p className="text-[#aba293] text-center py-36">Your cart is empty 🛒</p>
      ) : (
        cartProducts.map((product) => (
          <div
            key={product.productId + product.size + product.color}
            onClick={() => goToProduct(product.productId)}
            className="flex items-center justify-between p-3 mb-2 rounded-xl
                       bg-white
                       border border-[#ebdccb]/60 shadow-sm cursor-pointer
                       hover:border-[#c9973f]/50 hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg border border-[#ebdccb] bg-[#f0ece2]"
            />

            <div className="flex-1 ml-4">
              <h3 className="text-base font-semibold text-[#0f0d0b]">{product.name}</h3>
              <p className="text-xs text-[#8e8577]">
                Size: {product.size} • Color: {product.color}
              </p>

              {/* Quantity Controls */}
              <div
                className="flex items-center space-x-2 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    decreaseQty(product.productId, product.size, product.color, product.quantity);
                  }}
                  className="px-3 py-1 border border-[#c9973f] rounded text-[#a87b32] hover:bg-[#c9973f] hover:text-white transition"
                >
                  -
                </button>
                <span className="px-2 text-[#0f0d0b] font-medium">{product.quantity}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    increaseQty(product.productId, product.size, product.color, product.quantity);
                  }}
                  className="px-3 py-1 border border-[#c9973f] rounded text-[#a87b32] hover:bg-[#c9973f] hover:text-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price + Remove */}
            <div
              className="flex flex-col items-end"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-sm font-bold text-[#a87b32]">
                ${(product.price * product.quantity).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(product.productId, product.size, product.color);
                }}
                aria-label="Remove item"
                className="mt-1 text-[#aba293] hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartContent;