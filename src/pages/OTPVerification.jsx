import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiClock, FiMail } from 'react-icons/fi';
import { Loader } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { otpVerify, resendOtp } from "../redux/slices/authSlice.js"; 
import { toast } from 'sonner'; 

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const [expireTime, setExpireTime] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const otpValues = watch(['digit1', 'digit2', 'digit3', 'digit4']);

  // Initialize timers from localStorage or defaults
  useEffect(() => {
    const otpExpire = localStorage.getItem('otpExpire');
    const resendExpire = localStorage.getItem('resendExpire');

    if (otpExpire) {
      const remaining = Math.floor((parseInt(otpExpire) - Date.now()) / 1000);
      setExpireTime(remaining > 0 ? remaining : 0);
    } else {
      setExpireTime(600); // default 10 minutes
      localStorage.setItem('otpExpire', Date.now() + 600000);
    }

    if (resendExpire) {
      const remainingResend = Math.floor((parseInt(resendExpire) - Date.now()) / 1000);
      setResendTimer(remainingResend > 0 ? remainingResend : 0);
    } else {
      setResendTimer(0);
    }
  }, []);

  // Expiry countdown
  useEffect(() => {
    if (expireTime > 0) {
      const timer = setTimeout(() => setExpireTime(expireTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expireTime]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      setValue(`digit${index + 1}`, value);
      if (value && index < 3) inputRefs.current[index + 1]?.focus();
      if (!value && index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

 const handleResendOTP = async () => {
  try {
    setIsResending(true);
    const otpData = { email: emailFromState };
    await dispatch(resendOtp(otpData)).unwrap();

    // Update timers
    const newExpire = Date.now() + 600000; // 10 minutes
    localStorage.setItem('otpExpire', newExpire);
    setExpireTime(300);

    const newResendExpire = Date.now() + 15000; // 15 seconds
    localStorage.setItem('resendExpire', newResendExpire);
    setResendTimer(15);

    toast.success("OTP resent successfully!", { duration: 2000 });
  } catch (err) {
    toast.error(err?.message || "Failed to resend OTP", { duration: 2000 });
  } finally {
    setIsResending(false);
  }
};

  const onSubmit = async (data) => {
  const otp = Object.values(data).join("");

  try {
    const response = await dispatch(otpVerify({ email: emailFromState, otp })).unwrap();

    toast.success(response?.message || "Account verified successfully!", { duration: 2000 });
    navigate("/login");
  } catch (err) {
    toast.error(err?.message || "Verification failed", { duration: 2000 });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link to="/login" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors">
          <FiArrowLeft className="mr-2" />
          Back to Login
        </Link>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-2xl text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-300">Enter the 4-digit code sent to your email</p>
            <p className="text-yellow-400 font-semibold mt-1">{emailFromState}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  {...register(`digit${index + 1}`, { required: 'All digits are required', pattern: { value: /^[0-9]$/, message: 'Must be a single digit' } })}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength="1"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-2xl font-bold text-center bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 text-white"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {errors.digit1 && <p className="text-red-400 text-center text-sm">{errors.digit1.message}</p>}

            <div className="text-center mb-6">
              <div className="flex items-center justify-center text-gray-400 text-sm">
                <FiClock className="mr-2" />
                <span>Code expires in </span>
                <span className={`ml-1 font-semibold ${expireTime < 60 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {formatTime(expireTime)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || expireTime === 0}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-gray-900 font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </span>
              ) : 'Verify Code'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || isResending || loading}
              className="text-yellow-400 hover:text-yellow-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-4 w-4 mr-1" />
                  Sending new code...
                </span>
              ) : resendTimer > 0 ? (
                `Request new code in ${resendTimer}s`
              ) : 'Send new verification code'}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Didn't receive the email? Check your spam folder or{' '}
            <button onClick={handleResendOTP} className="text-yellow-400 hover:text-yellow-300 underline">
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
