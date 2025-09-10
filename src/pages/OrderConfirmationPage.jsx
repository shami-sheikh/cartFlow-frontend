
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle, ShoppingBag, Truck, Mail, Phone, MapPin } from "lucide-react";


const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { createdOrder } = useSelector((state) => state.orders);

  // If no order, redirect to home
  useEffect(() => {
    if (!createdOrder) {
      navigate("/");
    }
  }, [createdOrder, navigate]);

  if (!createdOrder) return null;

  // Map backend order data to UI fields
  const orderData = {
    orderId: createdOrder._id || createdOrder.orderId || "-",
    orderDate: createdOrder.createdAt ? new Date(createdOrder.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    customer: {
      name: createdOrder.shippingAddress?.fullName || "-",
      email: createdOrder.shippingAddress?.email || "-",
      phone: createdOrder.shippingAddress?.number || "-",
      address: `${createdOrder.shippingAddress?.address || "-"}, ${createdOrder.shippingAddress?.city || "-"}, ${createdOrder.shippingAddress?.country || "-"} - ${createdOrder.shippingAddress?.postalCode || "-"}`,
    },
    paymentMethod: createdOrder.paymentMethod || "-",
    paymentId: createdOrder.paymentId || "-",
    items: (createdOrder.orderItems || []).map((item, idx) => ({
      id: item._id || idx,
      name: item.name,
      size: item.size,
      color: item.color,
      price: item.price,
      qty: item.quantity,
      image: item.image,
    })),
    total: createdOrder.totalPrice || 0,
    shipping: createdOrder.shippingPrice || 0,
    discount: createdOrder.discount || 0,
    grandTotal: createdOrder.totalPrice || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18130F] to-[#2a2520] text-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-block text-2xl font-bold bg-gradient-to-r from-[#C6A15B] to-[#8C6C3A] bg-clip-text text-transparent mb-4"
          >
            CartFlow
          </Link>
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-400">Thank you for your purchase. Your order has been confirmed.</p>
          <p className="text-[#C6A15B] font-semibold mt-2">Order ID: {orderData.orderId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="text-[#C6A15B]" />
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-[#29221C] rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <span className="font-semibold text-[#C6A15B]">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[#3D342D] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{orderData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{orderData.shipping}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-₹{orderData.discount}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#3D342D]">
                <span>Total</span>
                <span className="text-[#C6A15B]">₹{orderData.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#29221C] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="text-[#C6A15B]" />
                <span className="font-semibold">Estimated Delivery</span>
              </div>
              <p className="text-gray-400">{orderData.estimatedDelivery}</p>
            </div>
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#29221C] p-2 rounded">
                    <span className="font-bold text-[#C6A15B]">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white">{orderData.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#29221C] p-2 rounded">
                    <Mail className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{orderData.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#29221C] p-2 rounded">
                    <Phone className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{orderData.customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#29221C] p-2 rounded mt-1">
                    <MapPin className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Shipping Address</p>
                    <p className="text-white">{orderData.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID</span>
                  <span className="text-white text-sm">{orderData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-500 font-semibold">Paid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">{orderData.orderDate}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#C6A15B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-black text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Order Confirmation Email</p>
                    <p className="text-gray-400 text-sm">We've sent a confirmation email with your order details.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#C6A15B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-black text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Order Processing</p>
                    <p className="text-gray-400 text-sm">We'll prepare your order for shipment within 24 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#C6A15B] rounded-full flex items-center justify-center mt-1">
                    <span className="text-black text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Shipping Updates</p>
                    <p className="text-gray-400 text-sm">You'll receive tracking information once your order ships.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-[#C6A15B] text-black font-semibold rounded-lg hover:bg-[#d4b16c] transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            state={{ tab: "orders" }}
            className="px-6 py-3 border border-[#C6A15B] text-[#C6A15B] font-semibold rounded-lg hover:bg-[#C6A15B] hover:text-black transition-colors text-center"
          >
            View Order History
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;