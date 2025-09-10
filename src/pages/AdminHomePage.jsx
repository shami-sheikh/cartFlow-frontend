import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAdminOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  if (productsLoading || ordersLoading) {
    return <p className="text-center py-48 text-gray-300">Loading...</p>;
  }

  if (productsError) {
    return <p className="text-center text-red-400">Error: {productsError}</p>;
  }

  if (ordersError) {
    return <p className="text-center text-red-400">Error: {ordersError}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-200">
      {/* Header */}
      <h2 className="text-xl font-semibold text-center text-yellow-300 mb-6">
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="p-6 shadow-md rounded-lg bg-gray-900 hover:shadow-lg transition">
          <p className="text-lg font-semibold text-yellow-300">Revenue</p>
          <h2 className="text-3xl font-bold">₹{totalSales || 0}</h2>
        </div>

        <div className="p-6 shadow-md rounded-lg bg-gray-900 hover:shadow-lg transition">
          <p className="text-lg font-semibold text-yellow-300">Total Orders</p>
          <h2 className="text-3xl font-bold">{totalOrders || 0}</h2>
          <Link
            to="/admin/orders"
            className="text-luxury relative group inline-block mt-2"
          >
            Manage Orders
            <span className="absolute h-[2px] w-0 left-0 bottom-[-4px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full ease-in-out"></span>
          </Link>
        </div>

        <div className="p-6 shadow-md rounded-lg bg-gray-900 hover:shadow-lg transition">
          <p className="text-lg font-semibold text-yellow-300">
            Total Products
          </p>
          <h2 className="text-3xl font-bold">{products?.length || 0}</h2>
          <Link
            to="/admin/products"
            className="text-luxury relative group inline-block mt-2"
          >
            Manage Products
            <span className="absolute h-[2px] w-0 left-0 bottom-[-4px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full ease-in-out"></span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-semibold text-yellow-300 mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-yellow-300">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-2">₹{order.totalPrice}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        order.status === "Processing"
                          ? "text-yellow-300"
                          : order.status === "Shipped"
                          ? "text-blue-400"
                          : order.status === "Delivered"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {order.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-400 italic"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
