import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";

const ErrorPage = ({ code = 404, title = "Page Not Found" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Main Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <FiAlertTriangle className="text-5xl text-red-400" />
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-red-400 via-yellow-500 to-red-600 bg-clip-text text-transparent mb-4 drop-shadow-lg"
          >
            {code}
          </motion.h1>

          {/* Title */}
          <h2 className="text-3xl font-semibold text-white mb-4">{title}</h2>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-md mx-auto">
            Oops! The page you’re searching for isn’t available. It might have
            been moved, deleted, or perhaps it never existed. Let’s get you back
            on track.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/30"
            >
              <FiHome className="text-lg" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-700/70 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 border border-gray-600 shadow-md"
            >
              <FiArrowLeft className="text-lg" />
              Go Back
            </button>
          </div>

          {/* Help Links */}
          <div className="border-t border-gray-700/60 pt-6">
            <p className="text-gray-400 text-sm mb-4">Need further assistance?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:amirconcept12@gmail.com"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Contact Support
              </a>
              <span className="text-gray-600 hidden sm:block">•</span>
              <a
                href="/help"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Help Center
              </a>
              <span className="text-gray-600 hidden sm:block">•</span>
              <a
                href="/status"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                System Status
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Error Code: {code} • {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Luxora Admin System • v2.1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
