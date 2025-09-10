import React from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { forgotPassword } from "../redux/slices/authSlice.js";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Send OTP
  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        forgotPassword({ email: data.email })
      ).unwrap();

      toast.success(response?.message || "OTP sent to your email", {
        duration: 2000,
      });

      // Navigate to OTP verification page with email in state
      navigate("/forgot-password-verify", { state: { email: data.email } });
    } catch (err) {
      toast.error(err?.message || "Failed to send OTP", { duration: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link
          to="/login"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Login
        </Link>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-2xl text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-300">
              Enter your email address and we'll send you a 4-digit OTP to reset
              your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                autoComplete="off"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:border-yellow-400 transition-all duration-200"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-gray-900 font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
