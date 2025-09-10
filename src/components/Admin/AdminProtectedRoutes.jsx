// src/components/AdminProtectedRoutes.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("userToken");
  const location = useLocation();

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (user.role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />
};

export default AdminProtectedRoutes;