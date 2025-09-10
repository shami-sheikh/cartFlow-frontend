// src/components/ProtectedRoute.jsx (for layout routes with Outlet)
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("userToken");
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;