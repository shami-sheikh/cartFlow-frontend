import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreatedOrder } from "../../redux/slices/orderSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { clearCart, clearCartAsync } from "../../redux/slices/cartSlice";
import {
  createCheckout,
  createRazorpayOrder,
  verifyRazorpayPayment,
  finalizeCheckout,
} from "../../redux/slices/checkoutSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = cart?.products || [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const deliveryCharge = cartItems.length === 0 ? 0 : subtotal > 1000 ? 0 : 49;
  const discount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice ? item.price - item.discountPrice : 0) *
        (item.quantity || 1),
    0
  );
  const total = subtotal + deliveryCharge - discount;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Pre-fill name & email whenever user data becomes available/changes
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
  }, [user, setValue]);

  const paymentMethod = watch("paymentMethod");

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (formData, checkoutId) => {
    try {
      const razorRes = await dispatch(
        createRazorpayOrder({ checkoutId })
      ).unwrap();

      const order = razorRes.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CartFlow Store",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await dispatch(
              verifyRazorpayPayment({
                checkoutId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            const orderRes = await dispatch(
              finalizeCheckout({ checkoutId })
            ).unwrap();
            dispatch(setCreatedOrder(orderRes.order));
            await dispatch(clearCartAsync({ userId: user?._id, guestId }));
            dispatch(clearCart());

            toast.success("🎉 Payment successful! Order placed.");
            navigate("/order-confirmation");
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.number,
        },
        theme: { color: "#C6A15B" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.message || "Failed to initialize Razorpay");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error("🛑 No items in cart. Please add products before checkout.");
      return;
    }

    if (!user || !user._id) {
      toast.error("You must be logged in to place an order.");
      navigate("/login");
      return;
    }
    setIsProcessing(true);
    try {
      const checkout = await dispatch(
        createCheckout({
          checkoutItems: cartItems,
          shippingAddress: {
            fullName: data.name,
            email: data.email,
            number: data.number,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
          },
          paymentMethod: data.paymentMethod,
          totalPrice: total,
        })
      ).unwrap();

      const checkoutId = checkout.checkout._id;

      if (data.paymentMethod === "cod") {
        const orderRes = await dispatch(
          finalizeCheckout({ checkoutId })
        ).unwrap();
        dispatch(setCreatedOrder(orderRes.order));
        await dispatch(clearCartAsync({ userId: user._id, guestId }));
        dispatch(clearCart());
        toast.success("🎉 Order placed with COD!");
        navigate("/order-confirmation");
      } else if (data.paymentMethod === "razorpay") {
        const isLoaded = await loadRazorpayScript();
        if (isLoaded) {
          handleRazorpayPayment(
            {
              ...data,
              setCreatedOrder: (order) => dispatch(setCreatedOrder(order)),
            },
            checkoutId
          );
        } else {
          toast.error("Failed to load Razorpay SDK");
          setIsProcessing(false);
        }
      }
    } catch (err) {
      toast.error(err.message || "Checkout failed");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Shipping + Payment Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-2 bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-sm"
        >
          <h2
            className="text-2xl font-light text-[#0f0d0b] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Shipping Information
          </h2>

          {/* Full Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Full name is required" })}
                className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col mt-4">
            <input
              type="text"
              placeholder="Street Address"
              {...register("address", { required: "Address is required" })}
              className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
            />
            {errors.address && (
              <span className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* City + Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="City"
                {...register("city", { required: "City is required" })}
                className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
              />
              {errors.city && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Postal Code"
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
              />
              {errors.postalCode && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.postalCode.message}
                </span>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col mt-4">
            <input
              type="text"
              maxLength={10}
              placeholder="Phone Number"
              {...register("number", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
            />
            {errors.number && (
              <span className="text-red-500 text-sm mt-1">
                {errors.number.message}
              </span>
            )}
          </div>

          {/* Country */}
          <div className="flex flex-col mt-4">
            <select
              {...register("country", { required: "Country is required" })}
              className="p-3 rounded-lg w-full bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition"
              defaultValue=""
            >
              <option value="" disabled>
                Select Country
              </option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && (
              <span className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </span>
            )}
          </div>

          {/* Payment Method */}
          <h2
            className="text-2xl font-light text-[#0f0d0b] mt-8 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Payment Method
          </h2>
          <div className="flex gap-6 mb-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#0f0d0b]">
              <input
                type="radio"
                value="razorpay"
                {...register("paymentMethod", { required: true })}
                className="accent-[#c9973f]"
              />
              Razorpay
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#0f0d0b]">
              <input
                type="radio"
                value="cod"
                {...register("paymentMethod", { required: true })}
                className="accent-[#c9973f]"
              />
              Cash on Delivery
            </label>
          </div>
          {errors.paymentMethod && (
            <span className="text-red-500 text-sm">
              Please select a payment method
            </span>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="mt-8 w-full py-3 rounded-xl font-semibold text-white bg-[#0f0d0b] hover:bg-[#c9973f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>

          {paymentMethod === "razorpay" && (
            <p className="text-sm text-[#8e8577] mt-4 text-center">
              You will be redirected to Razorpay for secure payment.
            </p>
          )}
        </form>

        {/* Right: Order Summary */}
        <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-sm h-fit">
          <h2
            className="text-2xl font-light text-[#0f0d0b] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Order Summary
          </h2>
          <ul className="divide-y divide-[#ebdccb]/60">
            {cartItems.map((item, idx) => (
              <Link
                to={`/product/${item.productId}`}
                key={item._id || item.productId || idx}
                className="flex items-center justify-between py-4 gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg bg-[#f0ece2] border border-[#ebdccb]"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#0f0d0b]">{item.name}</p>
                  <p className="text-sm text-[#8e8577]">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-[#8e8577]">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-[#a87b32] whitespace-nowrap">
                  ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
              </Link>
            ))}
          </ul>

          <div className="space-y-2 mt-6 text-sm text-[#0f0d0b]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-[#5c5548]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span className="text-emerald-600">-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span className="text-[#5c5548]">
                {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg mt-6 border-t border-[#ebdccb] pt-4 text-[#0f0d0b]">
            <span>Total:</span>
            <span className="text-[#a87b32]">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;