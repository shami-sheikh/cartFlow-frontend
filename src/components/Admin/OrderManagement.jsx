import React, { useEffect, useState } from "react";
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
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Delivered":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen rounded-md bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-white">
          Order <span className="text-yellow-400">Management</span>
        </h2>

        {/* Orders */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">Order History</h3>
            <div className="text-sm text-gray-400">
              {orders?.length || 0} order{orders?.length !== 1 ? "s" : ""} total
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg">
            {loading ? (
              <div className="text-center py-6 text-yellow-300">Loading...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-400">{error}</div>
            ) : orders?.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-yellow-400">
                          #{order._id.slice(-6)} {/* Show only last 6 characters for brevity */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {order.user?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.shippingAddress?.email || order.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          ₹{order.totalPrice}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-md text-xs font-medium border focus:ring-2 focus:ring-yellow-400 focus:outline-none ${getStatusColor(order.status)}`}
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
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                          >
                            Mark Delivered
                          </button>
                        ) : (
                          <span className="text-green-400 font-semibold text-sm">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No orders found.</div>
                <p className="text-gray-400 text-sm">
                  Orders will appear here once they are placed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {orders?.length || 0}
            </div>
            <div className="text-gray-300">Total Orders</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {orders?.filter((o) => o.status === "Processing").length}
            </div>
            <div className="text-gray-300">Processing</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {orders?.filter((o) => o.status === "Delivered").length}
            </div>
            <div className="text-gray-300">Delivered</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              ₹
              {orders?.reduce((total, order) => total + order.totalPrice, 0).toFixed(2) || 0}
            </div>
            <div className="text-gray-300">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;