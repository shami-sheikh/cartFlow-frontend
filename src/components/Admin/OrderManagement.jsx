import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchAdminOrders, updateAdminOrderStatus } from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    const promise = dispatch(updateAdminOrderStatus({ id: orderId, status: newStatus })).unwrap();

    toast.promise(promise, {
      loading: 'Updating order status...',
      success: () => {
        return `Order status updated to ${newStatus}!`;
      },
      error: (error) => {
        return error.message || 'Failed to update order status';
      },
    });
  };

  const markAsDelivered = (orderId) => {
    const promise = dispatch(updateAdminOrderStatus({ id: orderId, status: "Delivered" })).unwrap();

    toast.promise(promise, {
      loading: 'Marking as delivered...',
      success: () => {
        return 'Order marked as Delivered!';
      },
      error: (error) => {
        return error.message || 'Failed to update order status';
      },
    });
  };

  // Badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-[#fcfaf6] text-[#a87b32] border-[#ebdccb]";
      case "Shipped":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-light mb-10 text-center text-[#0f0d0b]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Order Management
        </h2>

        {/* Orders */}
        <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-2xl font-light text-[#0f0d0b]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Order History
            </h3>
            <div className="text-sm font-medium text-[#8e8577] bg-[#fcfaf6] px-3 py-1 rounded-full border border-[#ebdccb]/60">
              {orders?.length || 0} order{orders?.length !== 1 ? "s" : ""} total
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#ebdccb]/40">
            {loading ? (
              <div className="text-center py-12 text-[#8e8577] font-medium">Loading orders...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500 font-medium">{error}</div>
            ) : orders?.length > 0 ? (
              <table className="min-w-full divide-y divide-[#ebdccb]/60">
                <thead className="bg-[#fcfaf6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#8e8577] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#ebdccb]/40">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#fcfaf6] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-semibold text-[#a87b32]">
                          #{order._id.slice(-6)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#0f0d0b]">
                          {order.user?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-[#8e8577] mt-0.5">
                          {order.shippingAddress?.email || order.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#5c5548]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-[#8e8577] mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-[#0f0d0b]">
                          ₹{order.totalPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border focus:ring-1 focus:ring-[#c9973f]/40 focus:outline-none transition-colors ${getStatusColor(order.status)}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.status !== "Delivered" ? (
                          <button
                            onClick={() => markAsDelivered(order._id)}
                            className="bg-white border border-[#ebdccb] text-[#5c5548] hover:border-[#c9973f]/60 hover:text-[#0f0d0b] px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        ) : (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl font-semibold text-sm">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <div className="text-[#8e8577] text-lg font-medium mb-2">No orders found.</div>
                <p className="text-[#aba293] text-sm">
                  Orders will appear here once they are placed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#0f0d0b] mb-1">
              {orders?.length || 0}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Total Orders</div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#a87b32] mb-1">
              {orders?.filter((o) => o.status === "Processing").length}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Processing</div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {orders?.filter((o) => o.status === "Delivered").length}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Delivered</div>
          </div>
          <div className="bg-white border border-[#ebdccb]/60 p-6 rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#a87b32] mb-1 truncate">
              ₹{(orders?.reduce((total, order) => total + order.totalPrice, 0) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[#8e8577] font-medium uppercase tracking-wider text-sm">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;