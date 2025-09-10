import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { Loader } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/slices/authSlice.js";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        resetPassword({ email: emailFromState, newPassword: data.password })
      ).unwrap();

      toast.success(response?.message || "Password updated successfully!", {
        duration: 2000,
      });
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || "Failed to update password", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link
          to="/forgot-password"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </Link>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-2xl text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h1>
            <p className="text-gray-300">Set a new password for your account</p>
            <p className="text-yellow-400 font-semibold mt-1">
              {emailFromState}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-gray-300 mb-2">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                           focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 
                           outline-none transition-all duration-200"
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                className="mr-2 accent-yellow-400"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="text-gray-300 text-sm">
                Show Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 
                         hover:from-yellow-600 hover:to-yellow-700 
                         disabled:from-gray-600 disabled:to-gray-700 
                         disabled:cursor-not-allowed 
                         text-gray-900 font-semibold py-4 rounded-lg 
                         transition-all duration-300 shadow-lg 
                         hover:shadow-yellow-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
