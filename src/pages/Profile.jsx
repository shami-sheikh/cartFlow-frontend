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

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "orders", label: "Orders", icon: Package },
  { key: "logout", label: "Logout", icon: LogOut },
];

const STATUS_STYLES = {
  Delivered: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Shipped: "text-blue-700 bg-blue-50 border-blue-200",
  Processing: "text-[#a87b32] bg-[#c9973f]/10 border-[#c9973f]/30",
  Cancelled: "text-red-700 bg-red-50 border-red-200",
};

const Profile = () => {
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const { user } = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const { updateProfileLoading, updateProfileError } = useSelector(
    (state) => state.auth
  );
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (user && !user.isVerified) {
      navigate("/login");
    }
  }, [user, navigate]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setValue, dispatch]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("userToken");

    dispatch(logout());
    dispatch(clearCart());

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  useEffect(() => {
    setValue("name", user?.name || "");
    setValue("email", user?.email || "");
    setProfileImage(user?.profileImage || null);
  }, [user, setValue]);

  const onSubmit = async (data) => {
    let imageUrl = profileImage;
    if (selectedFile) {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      try {
        const { data: uploadData } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (uploadData.success) {
          imageUrl = uploadData.imageUrl || (Array.isArray(uploadData.imageUrls) ? uploadData.imageUrls[0] : undefined);
          setProfileImage(imageUrl);
          setSelectedFile(null);
        } else {
          toast.error(uploadData.message || "Upload failed");
          setImageUploading(false);
          return;
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Upload error");
        setImageUploading(false);
        return;
      }
      setImageUploading(false);
    }
    const updateData = { name: data.name };
    if (imageUrl && imageUrl !== user?.profileImage) {
      updateData.profileImage = imageUrl;
    }
    dispatch(updateProfile(updateData)).then((action) => {
      if (action.type.endsWith("/fulfilled")) {
        setValue("name", action.payload.name);
        toast.success("Profile updated successfully!");
      }
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

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

  const { myOrders: orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(fetchMyOrders());
    }
  }, [activeTab, dispatch]);

  return (
    <div className="min-h-screen bg-[#fcfaf6]">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-[1px] bg-[#c9973f]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9973f] font-medium">
              Your Account
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-light text-[#0f0d0b] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Your Profile"}
          </h1>
        </div>

        {/* Tabs Header */}
        <div className="flex gap-2 mb-8 bg-white border border-[#ebdccb]/60 p-1.5 rounded-full w-fit shadow-sm">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === key
                  ? "bg-[#0f0d0b] text-white shadow-sm"
                  : "text-[#8e8577] hover:text-[#a87b32]"
              }`}
            >
              <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ebdccb]/60 shadow-sm">
            <h2
              className="text-xl font-light text-[#0f0d0b] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              My Profile
            </h2>

            {/* Profile Image Upload */}
            <div className="flex items-center gap-5 mb-8">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c9973f] relative shrink-0 shadow-sm"
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
                  <div className="w-full h-full flex items-center justify-center bg-[#f0ece2]">
                    <User size={36} className="text-[#aba293]" />
                  </div>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader className="h-7 w-7 text-white animate-spin" />
                  </div>
                )}
                {profileImage && !imageUploading && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedFile) {
                        setProfileImage(user?.profileImage || null);
                        setSelectedFile(null);
                      } else {
                        handleDeleteImage();
                      }
                    }}
                    className="absolute top-1 right-1 bg-red-500 p-1 rounded-full cursor-pointer hover:bg-red-600 transition shadow-sm"
                    title="Delete profile image"
                  >
                    <Trash size={12} className="text-white" />
                  </button>
                )}
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#a87b32] border border-[#c9973f] rounded-full px-4 py-2 hover:bg-[#c9973f] hover:text-white transition-all duration-300">
                <Upload size={15} />
                <span>Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                  disabled={imageUploading}
                />
              </label>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8e8577] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-2.5 border rounded-lg bg-[#fcfaf6] text-[#0f0d0b] border-[#e1dacd] focus:outline-none focus:border-[#c9973f] focus:ring-1 focus:ring-[#c9973f]/30 transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8e8577] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  disabled
                  className="w-full px-4 py-2.5 border rounded-lg bg-[#f0ece2] text-[#aba293] border-[#e1dacd] cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0f0d0b] flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold hover:bg-[#c9973f] transition disabled:opacity-60"
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
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ebdccb]/60 shadow-sm">
            <h2
              className="text-xl font-light text-[#0f0d0b] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              My Orders
            </h2>
            {ordersLoading ? (
              <p className="text-[#8e8577]">Loading orders...</p>
            ) : orders && orders.length > 0 ? (
              <ul className="space-y-5">
                {orders.map((order) => {
                  const statusStyle =
                    STATUS_STYLES[order.status] ||
                    "text-[#8e8577] bg-[#f0ece2] border-[#e1dacd]";
                  return (
                    <li
                      key={order._id}
                      className="p-4 border border-[#ebdccb]/60 rounded-xl bg-[#fcfaf6]"
                    >
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-3 gap-3">
                        <div>
                          <p className="text-sm text-[#0f0d0b]">
                            <span className="font-semibold">Order ID:</span>{" "}
                            <span className="text-[#8e8577]">{order._id}</span>
                          </p>
                          <p className="text-xs text-[#aba293] mt-0.5">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${statusStyle}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      {/* Shipping Info */}
                      <div className="mb-4 text-xs text-[#8e8577]">
                        <span className="font-semibold text-[#5c5548]">
                          Shipping to:
                        </span>{" "}
                        {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.country}
                      </div>
                      {/* Products in the Order */}
                      <Link
                        to={`/order-details/${order._id}`}
                        className="space-y-2 block"
                      >
                        {order.orderItems?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-3 rounded-lg bg-white border border-[#ebdccb]/50 hover:border-[#c9973f]/40 transition"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-md border border-[#e1dacd] bg-[#f0ece2]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0f0d0b] text-sm truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-[#a87b32] font-medium">${item.price}</p>
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider shrink-0 px-2 py-1 rounded-full ${
                                order.isPaid
                                  ? "text-emerald-700 bg-emerald-50"
                                  : "text-red-600 bg-red-50"
                              }`}
                            >
                              {order.isPaid ? "Paid" : "Not Paid"}
                            </span>
                          </div>
                        ))}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Package size={36} className="mx-auto mb-3 text-[#e1dacd]" />
                <p className="text-[#aba293]">No orders found yet.</p>
                <Link
                  to="/collections/all"
                  className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-[#a87b32] border-b border-[#a87b32] pb-0.5"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Logout Tab */}
        {activeTab === "logout" && (
          <div className="bg-white p-8 rounded-2xl border border-[#ebdccb]/60 shadow-sm text-center">
            <LogOut size={28} className="mx-auto mb-3 text-[#aba293]" />
            <p className="text-[#5c5548] mb-5">Are you sure you want to logout?</p>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isLoggingOut && <Loader className="h-4 w-4 animate-spin" />}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;