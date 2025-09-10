import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Package, LogOut, Upload, Loader, Trash } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";
import { fetchProfile, updateProfile } from "../redux/slices/authSlice";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const [isLoggingOut ,setIsLoggingOut] = useState(false)
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const { user } = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const { updateProfileLoading, updateProfileError } = useSelector(
    (state) => state.auth
  );
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Fetch latest profile on mount using Redux thunk
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchProfile()).then((action) => {
        if (action.payload) {
          setValue("name", action.payload.name);
          setValue("email", action.payload.email);
        }
      });
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setValue, dispatch]);

  const handleLogout = () => {
    // Clear local storage first to prevent any auth-related issues
    localStorage.removeItem("userToken");

    // Dispatch logout actions
    dispatch(logout());
    dispatch(clearCart());

    // Use replace instead of navigate to avoid history stack issues
    // Add a small delay to ensure state updates complete before navigation
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  // Keep form and image in sync with Redux user
  useEffect(() => {
    setValue("name", user?.name || "");
    setValue("email", user?.email || "");
    setProfileImage(user?.profileImage || null);
  }, [user, setValue]);

  // submit also updating the profile
  const onSubmit = (data) => {
    // Only send profileImage if a new image was uploaded
    const updateData = { name: data.name };
    if (profileImage && profileImage !== user?.profileImage) {
      updateData.profileImage = profileImage;
    }
    dispatch(updateProfile(updateData)).then((action) => {
      if (action.type.endsWith("/fulfilled")) {
        setValue("name", action.payload.name);
        toast.success("Profile updated successfully!");
      }
    });
  };

  // image uloading function backend routes no thunk
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setProfileImage(data.imageUrl); // Cloudinary URL
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload error");
      console.error("Upload Error:", error);
    }
  };

  // Delete profile image
  const handleDeleteImage = async () => {
    if (!profileImage) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete-profile`,
        {
          data: { imageUrl: profileImage },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (data.success) {
        setProfileImage(null);
        // Update Redux user state so UI updates immediately
        dispatch(updateProfile({ profileImage: null }));
        toast.success("Profile image deleted!");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete error");
      console.error("Delete Error:", error);
    }
  };

  // Redux orders state
  const { myOrders: orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  // Fetch orders when Orders tab is activated
  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(fetchMyOrders());
    }
  }, [activeTab, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs Header */}
      <div className="flex space-x-6 border-b border-gray-700 pb-3 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${
            activeTab === "profile"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-gray-300 hover:text-yellow-400"
          }`}
        >
          <User size={18} /> <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${
            activeTab === "orders"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-gray-300 hover:text-yellow-400"
          }`}
        >
          <Package size={18} /> <span>Orders</span>
        </button>

        <button
          onClick={() => setActiveTab("logout")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${
            activeTab === "logout"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-gray-300 hover:text-yellow-400"
          }`}
        >
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">
            My Profile
          </h2>

          {/* Profile Image Upload */}
          <div className="flex items-center gap-4 mb-6 relative">
            <div
              className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400 relative"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {profileImage || user?.profileImage ? (
                <img
                  src={profileImage || user?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <User size={40} color="#d1d5db" />
                </div>
              )}
              {profileImage && (
                <div
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-0 bg-red-600 p-1 rounded-full cursor-pointer hover:bg-red-700 transition"
                >
                  <Trash size={16} color="#fff" />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300">
              <Upload size={18} />
              <span>Upload New</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-gray-100 border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email (disabled) */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 flex items-center justify-center gap-2 text-black py-2 rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-60"
              disabled={updateProfileLoading}
            >
              {updateProfileLoading ? (
                <>
                  Updating...
                  <Loader className="h-5 w-5 animate-spin" />
                </>
              ) : (
                "Update Profile"
              )}
            </button>
            {updateProfileError && (
              <p className="text-red-500 text-xs mt-2">{updateProfileError}</p>
            )}
          </form>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">
            My Orders
          </h2>
          {ordersLoading ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : orders && orders.length > 0 ? (
            <ul className="space-y-6">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-300"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p>
                        <span className="font-semibold">Order ID:</span>{" "}
                        {order._id}
                      </p>
                      <p className="text-sm text-gray-400">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          order.status === "Delivered"
                            ? "text-green-400"
                            : order.status === "Shipped"
                            ? "text-blue-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>
                  {/* Shipping Info */}
                  <div className="mb-4 text-sm text-gray-400">
                    <p>
                      <span className="font-semibold text-gray-300">
                        Shipping Address:
                      </span>{" "}
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.country}
                    </p>
                  </div>
                  {/* Products in the Order */}
                  <Link
                    to={`/order-details/${order._id}`}
                    className="space-y-3 block"
                  >
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-700"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border border-gray-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-400">${item.price}</p>
                        </div>
                        <div>
                          <span
                            className={`text-sm font-medium ${
                              order.isPaid ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {order.isPaid ? "Paid" : "Not Paid"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No orders found.</p>
          )}
        </div>
      )}

      {/* Logout Tab */}
      {activeTab === "logout" && (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md text-center">
          <p className="text-gray-300 mb-4">Are you sure you want to logout?</p>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
