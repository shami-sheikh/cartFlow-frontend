import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderDetails,
  clearOrderDetails,
} from "../redux/slices/orderSlice";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Download,
  Printer,
  MessageCircle,
} from "lucide-react";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) dispatch(fetchOrderDetails(orderId));
    return () => dispatch(clearOrderDetails());
  }, [dispatch, orderId]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-600";
      case "Shipped":
        return "text-blue-600";
      case "Processing":
        return "text-[#a87b32]";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-[#8e8577]";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="text-emerald-600" size={20} />;
      case "Shipped":
        return <Truck className="text-blue-600" size={20} />;
      case "Processing":
        return <Clock className="text-[#a87b32]" size={20} />;
      default:
        return <Package className="text-[#8e8577]" size={20} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8e8577] bg-[#fcfaf6]">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-[#fcfaf6]">
        {error}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8e8577] bg-[#fcfaf6]">
        Order not found.
      </div>
    );
  }

  const orderItems = orderDetails.orderItems || [];
  const selectedProduct = orderItems[selectedProductIdx] || orderItems[0];

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#0f0d0b] px-4 py-12">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            left: 0; top: 0; width: 100vw; background: #fff !important; color: #000 !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto print-area">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/profile"
            state={{ tab: "orders" }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[#ebdccb] text-[#5c5548] bg-white hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors duration-300 shadow-sm"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
          <h1
            className="md:text-4xl text-2xl font-light text-[#0f0d0b]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Order Details
          </h1>
          <div className="flex gap-3 no-print">
            <button
              onClick={handlePrint}
              className="p-2.5 border border-[#ebdccb] text-[#5c5548] bg-white rounded-xl hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors shadow-sm"
              title="Print Order Details"
            >
              <Printer size={20} />
            </button>
            {/* Download button can be implemented with html2pdf or similar if needed */}
            <button
              className="p-2.5 border border-[#ebdccb] text-[#5c5548] bg-white rounded-xl hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
              title="Download as PDF (use Print to PDF)"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#fcfaf6] p-3 rounded-full border border-[#ebdccb]/60">
                {getStatusIcon(orderDetails.status)}
              </div>
              <div>
                <h2
                  className={`text-2xl font-semibold ${getStatusColor(
                    orderDetails.status
                  )} capitalize`}
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {orderDetails.status}
                </h2>
                <p className="text-[#8e8577] text-sm mt-0.5">Order #{orderDetails._id}</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[#8e8577] text-sm uppercase tracking-wider font-medium mb-0.5">Placed on</p>
              <p className="font-semibold text-[#0f0d0b]">
                {new Date(orderDetails.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#ebdccb]/60 mb-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "details"
                ? "text-[#a87b32] border-b-2 border-[#a87b32]"
                : "text-[#8e8577] hover:text-[#0f0d0b]"
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "tracking"
                ? "text-[#a87b32] border-b-2 border-[#a87b32]"
                : "text-[#8e8577] hover:text-[#0f0d0b]"
            }`}
          >
            Tracking
          </button>
        </div>

        {/* Order Details Tab */}
        {activeTab === "details" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Details */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60 h-fit">
              <h2
                className="text-2xl font-light mb-6 flex items-center gap-2 text-[#0f0d0b]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                <Package className="text-[#a87b32]" size={24} />
                Order Products
              </h2>

              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {orderItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedProductIdx(idx)}
                    className={`flex flex-col items-center p-3 rounded-xl border transition-all min-w-[100px] ${
                      selectedProductIdx === idx
                        ? "border-[#c9973f] bg-[#fcfaf6] text-[#a87b32] shadow-sm"
                        : "border-[#ebdccb]/60 bg-white text-[#8e8577] hover:border-[#c9973f]/60 hover:text-[#0f0d0b]"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg mb-2 bg-[#f0ece2] border border-[#ebdccb]/40"
                    />
                    <span className="text-xs font-medium truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {selectedProduct && (
                <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-[#fcfaf6] border border-[#ebdccb]/40 rounded-xl">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-24 h-24 object-cover rounded-lg bg-[#f0ece2] border border-[#ebdccb]"
                  />
                  <div className="flex-1 w-full text-center sm:text-left">
                    <p className="font-medium text-[#0f0d0b] text-lg mb-1">
                      {selectedProduct.name}
                    </p>
                    <p className="text-sm text-[#8e8577] mb-1">
                      {selectedProduct.size &&
                        `Size: ${selectedProduct.size} | `}
                      {selectedProduct.color &&
                        `Color: ${selectedProduct.color}`}
                    </p>
                    <p className="text-sm text-[#5c5548] mb-2">
                      Qty: {selectedProduct.quantity}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#ebdccb]/60 capitalize ${getStatusColor(
                        orderDetails.status
                      )}`}
                    >
                      {orderDetails.status}
                    </span>
                  </div>
                  <div className="text-center sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#ebdccb]/60">
                    <p className="font-semibold text-[#a87b32]">
                      ₹{selectedProduct.price}
                    </p>
                    <p className="text-sm text-[#8e8577] my-0.5">
                      x {selectedProduct.quantity}
                    </p>
                    <p className="font-bold text-[#0f0d0b] text-lg">
                      ₹{(selectedProduct.price * selectedProduct.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60">
                <h2
                  className="text-2xl font-light mb-6 text-[#0f0d0b]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Order Summary
                </h2>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-[#0f0d0b] font-medium">Total</span>
                  <span className="text-[#a87b32] font-bold">
                    ₹{orderDetails.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60">
                <h2
                  className="text-2xl font-light mb-6 flex items-center gap-2 text-[#0f0d0b]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  <MapPin className="text-[#a87b32]" size={24} />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-[#5c5548]">
                  <p className="font-medium text-[#0f0d0b] text-lg mb-1">
                    {orderDetails.shippingAddress?.fullName}
                  </p>
                  <p className="leading-relaxed">
                    {orderDetails.shippingAddress?.address},{" "}
                    {orderDetails.shippingAddress?.city},{" "}
                    {orderDetails.shippingAddress?.country}
                  </p>
                  <p className="pt-2">
                    <span className="text-[#8e8577] text-sm uppercase tracking-wider font-medium mr-2">Phone:</span>
                    {orderDetails.shippingAddress?.number}
                  </p>
                  <p>
                    <span className="text-[#8e8577] text-sm uppercase tracking-wider font-medium mr-2">Email:</span>
                    {orderDetails.shippingAddress?.email}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60">
                <h2
                  className="text-2xl font-light mb-6 flex items-center gap-2 text-[#0f0d0b]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  <CreditCard className="text-[#a87b32]" size={24} />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#ebdccb]/30 pb-3">
                    <span className="text-[#8e8577]">Method</span>
                    <span className="font-medium text-[#0f0d0b] capitalize">
                      {orderDetails.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#ebdccb]/30 pb-3">
                    <span className="text-[#8e8577]">Status</span>
                    <span
                      className={`${
                        orderDetails.isPaid
                          ? "text-emerald-600"
                          : "text-red-500"
                      } font-semibold capitalize`}
                    >
                      {orderDetails.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[#8e8577]">Amount</span>
                    <span className="font-bold text-[#a87b32] text-lg">
                      ₹{orderDetails.totalPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60 no-print">
                <h2
                  className="text-2xl font-light mb-3 text-[#0f0d0b]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Need Help?
                </h2>
                <p className="text-[#8e8577] mb-6">
                  If you have any questions about your order, we're here to help.
                </p>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=amirsaikh950@gmail.com&su=Order%20Support%20Request%20for%20Order%20${orderDetails._id}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0f0d0b] text-white font-semibold rounded-xl hover:bg-[#c9973f] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={20} />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Tracking Tab */
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebdccb]/60 max-w-3xl mx-auto">
            <h2
              className="text-2xl font-light mb-8 text-[#0f0d0b]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Product Tracking
            </h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#fcfaf6] border border-[#ebdccb]/60 rounded-full flex items-center justify-center">
                    {getStatusIcon(orderDetails.status)}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-[#0f0d0b] text-lg mb-1">
                    {selectedProduct?.name}
                  </h3>
                  <p className="text-[#5c5548] text-sm">
                    Order status:{" "}
                    <span className={`font-medium ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status}
                    </span>
                  </p>
                  {orderDetails.deliveredAt && (
                    <p className="text-[#8e8577] text-xs mt-2 font-medium">
                      Delivered: {new Date(orderDetails.deliveredAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;