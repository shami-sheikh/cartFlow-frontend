import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Loader, EyeOff, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, fetchProfile } from "../redux/slices/authSlice.js";
import { mergeCart } from "../redux/slices/cartSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location  = useLocation()
  const { loading } = useSelector((state) => state.auth);
  // Get redirect path from query params, fallback to "/"
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

   const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const res = await dispatch(
          loginUser({ email: data.email, password: data.password })
        ).unwrap();

        toast.success(res.message || "Login successfully!", { duration: 2000 });

        // Merge guest cart if guestId exists
        const guestId = localStorage.getItem("guestId");
        if (guestId) {
          await dispatch(mergeCart({ guestId, user: res.user }));
        }

  // Fetch latest profile so navbar/profile image updates
  await dispatch(fetchProfile());
  navigate(redirect); //  redirect back after login
      } else {
        const res = await dispatch(registerUser(data)).unwrap();

        toast.success(
          res.message || "Registration successful! Please verify your email.",
          { duration: 2000 }
        );
        navigate("/otp-verify", { state: { email: data.email } });
      }

      reset();
    } catch (err) {
      toast.error(err?.message || "An error occurred", { duration: 2000 });
    }
  };
  // (Different for Login & Register)
  const loginImage =
    "https://plus.unsplash.com/premium_photo-1683288537078-a04cc87545f6?w=600&auto=format&fit=crop&q=60";
  const registerImage =
    "https://plus.unsplash.com/premium_photo-1681487899272-f0e55f4fb7e0?w=600&auto=format&fit=crop&q=60";

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1c1917] to-black px-4">
      <div className="w-full max-w-5xl bg-[#1a1714] border border-[#eacd89]/30 shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side (Form) */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#eacd89] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isLogin
              ? "Login to access your account and explore our collections."
              : "Register to get started and join our community."}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name (Register only) */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", {
                    required: !isLogin && "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:border-[#eacd89] transition"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:border-[#eacd89] transition"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:border-[#eacd89] transition"
              />
              {/* Toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-[#eacd89]"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div>
                <Link
                  to={`/forgot-password`}
                  className="text-[#eacd89] hover:underline text-sm"
                >
                  Forgot password
                </Link>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#eacd89] text-black font-semibold hover:bg-[#d4b86c] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  Processing...
                  <Loader className="h-5 w-5 animate-spin" />
                </>
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-gray-400 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                reset();
              }}
              className="text-[#eacd89] font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>

        {/* Right Side (Dynamic Image) */}
        <div className="hidden lg:block lg:w-1/2 relative object-cover">
          <img
            src={isLogin ? loginImage : registerImage}
            alt={isLogin ? "Login Illustration" : "Register Illustration"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Login;
