import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateCart,
  deleteFromCart,
  clearCart,
  clearCartAsync,
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart, guestId, userId, onClose }) => {
  const dispatch = useDispatch();
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

  return (
    <div>
      {/* Header with Clear Cart */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#eacd89]">Your Cart</h2>
        {cartProducts.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-[#eacd89] hover:text-white transition"
          >
            Clear Cart ✖
          </button>
        )}
      </div>

      {/* Cart Items */}
      {cartProducts.length === 0 ? (
        <p className="text-[#eacd89]/80 text-center py-36">Your cart is empty 🛒</p>
      ) : (
        cartProducts.map((product) => (
          <Link
            to={`/product/${product.productId}`}
            key={product.productId + product.size + product.color}
            onClick={onClose} // closes drawer on click
            className="flex items-center justify-between p-3 mb-2 rounded-xl 
                       bg-gradient-to-r from-[#1a1410] to-[#0D0D0D] 
                       border border-[#eacd89]/20 shadow-sm cursor-pointer 
                       hover:bg-[#2a2117] transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg border border-[#eacd89]/30"
            />

            <div className="flex-1 ml-4">
              <h3 className="text-base font-semibold text-[#eacd89]">{product.name}</h3>
              <p className="text-xs text-[#eacd89]/70">
                Size: {product.size} • Color: {product.color}
              </p>

              {/* Quantity Controls */}
              <div
                className="flex items-center space-x-2 mt-2"
                onClick={(e) => e.preventDefault()} // stop Link when clicking qty
              >
                <button
                  onClick={() =>
                    decreaseQty(product.productId, product.size, product.color, product.quantity)
                  }
                  className="px-3 py-1 border border-[#eacd89] rounded text-[#eacd89] hover:bg-[#eacd89] hover:text-black transition"
                >
                  -
                </button>
                <span className="px-2 text-[#eacd89]">{product.quantity}</span>
                <button
                  onClick={() =>
                    increaseQty(product.productId, product.size, product.color, product.quantity)
                  }
                  className="px-3 py-1 border border-[#eacd89] rounded text-[#eacd89] hover:bg-[#eacd89] hover:text-black transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price + Remove */}
            <div
              className="flex flex-col items-end"
              onClick={(e) => e.preventDefault()} // prevent link on remove
            >
              <div className="text-sm font-bold text-[#eacd89]">
                ${(product.price * product.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(product.productId, product.size, product.color)}
                className="mt-1 text-[#eacd89]/70 hover:text-red-500 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                  alt="remove"
                  className="w-4 h-4 invert"
                />
              </button>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default CartContent;
