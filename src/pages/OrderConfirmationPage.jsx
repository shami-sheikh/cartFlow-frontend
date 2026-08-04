import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CheckCircle,
  ShoppingBag,
  Truck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

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
    orderDate: createdOrder.createdAt
      ? new Date(createdOrder.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    customer: {
      name: createdOrder.shippingAddress?.fullName || "-",
      email: createdOrder.shippingAddress?.email || "-",
      phone: createdOrder.shippingAddress?.number || "-",
      address: `${createdOrder.shippingAddress?.address || "-"}, ${
        createdOrder.shippingAddress?.city || "-"
      }, ${createdOrder.shippingAddress?.country || "-"} - ${
        createdOrder.shippingAddress?.postalCode || "-"
      }`,
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
    <div className="min-h-screen bg-[#fcfaf6] text-[#0f0d0b] px-4 py-12">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            left: 0; top: 0; width: 100%; background: #fff !important; color: #000 !important;
            box-shadow: none !important;
            padding: 20px !important;
            margin: 0 !important;
            font-family: Arial, sans-serif;
          }
          .print-area h1,
          .print-area h2,
          .print-area h3,
          .print-area p,
          .print-area span {
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 no-print">
          <Link
            to="/"
            className="inline-block text-3xl font-semibold text-[#0f0d0b] mb-6 tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            CartFlow
          </Link>
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-50 p-4 rounded-full border border-emerald-100 shadow-sm">
              <CheckCircle className="w-16 h-16 text-emerald-600" />
            </div>
          </div>
          <h1
            className="text-4xl font-light text-[#0f0d0b] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-[#8e8577]">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-[#a87b32] font-semibold mt-2">
            Order ID: {orderData.orderId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print-area">
          {/* Left Column - Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60">
            <h2
              className="text-2xl font-light mb-6 flex items-center gap-2 text-[#0f0d0b]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <ShoppingBag className="text-[#a87b32] no-print" size={24} />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-[#fcfaf6] border border-[#ebdccb]/40 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#f0ece2] border border-[#ebdccb]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#0f0d0b]">{item.name}</p>
                    <p className="text-sm text-[#8e8577] no-print">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-[#5c5548]">Qty: {item.qty}</p>
                  </div>
                  <span className="font-semibold text-[#a87b32]">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-[#ebdccb]/60 pt-5 text-[#0f0d0b]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#5c5548]">₹{orderData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#5c5548]">₹{orderData.shipping}</span>
              </div>
              <div className="flex justify-between text-emerald-600 no-print">
                <span>Discount</span>
                <span>-₹{orderData.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 mt-2 border-t border-[#ebdccb]/60 text-[#0f0d0b]">
                <span>Total</span>
                <span className="text-[#a87b32] no-print">
                  ₹{orderData.grandTotal.toFixed(2)}
                </span>
                <span className="print-only">
                  ₹{orderData.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8 p-5 bg-[#fcfaf6] border border-[#ebdccb]/40 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-[#0f0d0b]">
                <Truck className="text-[#a87b32] no-print" size={20} />
                <span className="font-semibold">Estimated Delivery</span>
              </div>
              <p className="text-[#5c5548]">{orderData.estimatedDelivery}</p>
            </div>
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60">
              <h2
                className="text-2xl font-light mb-6 text-[#0f0d0b]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Customer Information
              </h2>
              <div className="space-y-4 text-[#0f0d0b]">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#a87b32] no-print">👤</span>
                  <div>
                    <p className="text-xs font-medium text-[#8e8577] uppercase tracking-wider no-print mb-0.5">Name</p>
                    <p>{orderData.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[#a87b32] no-print" />
                  <div>
                    <p className="text-xs font-medium text-[#8e8577] uppercase tracking-wider no-print mb-0.5">Email</p>
                    <p>{orderData.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-[#a87b32] no-print" />
                  <div>
                    <p className="text-xs font-medium text-[#8e8577] uppercase tracking-wider no-print mb-0.5">Phone</p>
                    <p>{orderData.customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#a87b32] no-print mt-1" />
                  <div>
                    <p className="text-xs font-medium text-[#8e8577] uppercase tracking-wider no-print mb-0.5">
                      Shipping Address
                    </p>
                    <p className="leading-relaxed">{orderData.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60">
              <h2
                className="text-2xl font-light mb-6 text-[#0f0d0b]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Payment Information
              </h2>
              <div className="space-y-3 text-[#0f0d0b]">
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8577] no-print">Method</span>
                  <span className="font-medium capitalize">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8577] no-print">Payment ID</span>
                  <span className="text-sm font-medium">{orderData.paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8577] no-print">Status</span>
                  <span className="text-emerald-600 font-semibold no-print">
                    Paid
                  </span>
                  <span className="print-only">Paid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8577] no-print">Date</span>
                  <span className="font-medium">{orderData.orderDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center no-print">
          <Link
            to="/"
            className="px-8 py-3 bg-[#0f0d0b] text-white font-semibold rounded-xl hover:bg-[#c9973f] transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            state={{ tab: "orders" }}
            className="px-8 py-3 border border-[#c9973f] text-[#a87b32] font-semibold rounded-xl hover:bg-[#c9973f] hover:text-white transition-colors text-center"
          >
            View Order History
          </Link>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 border border-[#ebdccb] text-[#5c5548] font-semibold rounded-xl hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;