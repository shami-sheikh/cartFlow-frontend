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
        return "text-green-500";
      case "Shipped":
        return "text-blue-500";
      case "Processing":
        return "text-yellow-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="text-green-500" size={20} />;
      case "Shipped":
        return <Truck className="text-blue-500" size={20} />;
      case "Processing":
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Order not found.
      </div>
    );
  }

  const orderItems = orderDetails.orderItems || [];
  const selectedProduct = orderItems[selectedProductIdx] || orderItems[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18130F] to-[#2a2520] text-gray-100 px-4 py-8">
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
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/profile"
            state={{ tab: "orders" }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full border border-[#eacd89] text-[#eacd89] hover:bg-[#eacd89] hover:text-black transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
          <h1 className="md:text-3xl font-bold text-white">Order Details</h1>
          <div className="flex gap-3 no-print">
            <button
              onClick={handlePrint}
              className="p-2 border border-[#C6A15B] text-[#C6A15B] rounded-lg hover:bg-[#C6A15B] hover:text-black transition-colors"
              title="Print Order Details"
            >
              <Printer size={20} />
            </button>
            {/* Download button can be implemented with html2pdf or similar if needed */}
            <button
              className="p-2 border border-[#C6A15B] text-[#C6A15B] rounded-lg hover:bg-[#C6A15B] hover:text-black transition-colors"
              disabled
              title="Download as PDF (use Print to PDF)"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(orderDetails.status)}
              <div>
                <h2
                  className={`text-xl font-bold ${getStatusColor(
                    orderDetails.status
                  )} capitalize`}
                >
                  {orderDetails.status}
                </h2>
                <p className="text-gray-400">Order #{orderDetails._id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Placed on</p>
              <p className="font-semibold">
                {new Date(orderDetails.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3D342D] mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "details"
                ? "text-[#C6A15B] border-b-2 border-[#C6A15B]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "tracking"
                ? "text-[#C6A15B] border-b-2 border-[#C6A15B]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Tracking
          </button>
        </div>

        {/* Order Details Tab */}
        {activeTab === "details" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Details */}
            <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-[#C6A15B]" />
                Order Products
              </h2>
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {orderItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedProductIdx(idx)}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg border transition-all ${
                      selectedProductIdx === idx
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-gray-700 text-gray-300 hover:border-yellow-400"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded mb-1"
                    />
                    <span className="text-xs font-medium truncate max-w-[80px]">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
              {selectedProduct && (
                <div className="flex items-center gap-4 p-4 bg-[#29221C] rounded-lg">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {selectedProduct.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedProduct.size &&
                        `Size: ${selectedProduct.size} | `}
                      {selectedProduct.color &&
                        `Color: ${selectedProduct.color}`}
                    </p>
                    <p className="text-sm text-gray-400">
                      Qty: {selectedProduct.quantity}
                    </p>
                    <span
                      className={`text-sm capitalize ${getStatusColor(
                        orderDetails.status
                      )}`}
                    >
                      {orderDetails.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#C6A15B]">
                      ₹{selectedProduct.price}
                    </p>
                    <p className="text-sm text-gray-400">
                      x {selectedProduct.quantity}
                    </p>
                    <p className="font-semibold text-white">
                      ₹{selectedProduct.price * selectedProduct.quantity}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-[#C6A15B]">
                    ₹{orderDetails.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="text-[#C6A15B]" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">
                    {orderDetails.shippingAddress?.fullName}
                  </p>
                  <p className="text-gray-400">
                    {orderDetails.shippingAddress?.address},{" "}
                    {orderDetails.shippingAddress?.city},{" "}
                    {orderDetails.shippingAddress?.country}
                  </p>
                  <p className="text-gray-400">
                    {orderDetails.shippingAddress?.number}
                  </p>
                  <p className="text-gray-400">
                    {orderDetails.shippingAddress?.email}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="text-[#C6A15B]" />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="font-semibold">
                      {orderDetails.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between ">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`${
                        orderDetails.isPaid
                          ? "text-green-500"
                          : "text-red-500  text-sm border-red-500 rounded-full "
                      } font-semibold  capitalize`}
                    >
                      {orderDetails.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span className="font-semibold text-[#C6A15B]">
                      ₹{orderDetails.totalPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Need Help?</h2>
                <p className="text-gray-400 mb-4">
                  If you have any questions about your order, we're here to
                  help.
                </p>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=amirsaikh950@gmail.com&su=Order%20Support%20Request%20for%20Order%20${orderDetails._id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C6A15B] text-black font-semibold rounded-lg hover:bg-[#d4b16c] transition-colors"
                  style={{ textAlign: "center" }}
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
          <div className="bg-[#1F1A16] p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6">Product Tracking</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#29221C] rounded-full flex items-center justify-center">
                    {getStatusIcon(orderDetails.status)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {selectedProduct?.name}
                  </h3>
                  <p className={`text-white text-sm`}>
                    Order status:{" "}
                    <span className={`${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status}
                    </span>
                  </p>
                  {orderDetails.deliveredAt && (
                    <p className={` text-gray-500 text-xs mt-1`}>
                      {new Date(orderDetails.deliveredAt).toLocaleString()}
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
