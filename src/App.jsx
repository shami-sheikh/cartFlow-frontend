import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Scroller from "./components/Common/Scroller";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import Checkout from "./components/Cart/Checkout.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import AddProduct from "./components/Admin/AddProduct.jsx";
import ProductEditPage from "./components/Admin/ProductEditPage.jsx";
import OrderManagement from "./components/Admin/OrderManagement.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import OTPVerification from "./pages/OTPVerification.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPasswordOtpVerification from "./pages/ForgotPasswordOtpVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ScrollToTop from "./components/Products/ScrollToTop.jsx";
import CustomCursor from "./hooks/CustomCursor.js"
import AdminProtectedRoutes from "./components/Admin/AdminProtectedRoutes.jsx";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <CustomCursor/>
        <Toaster position="top-right" />
        <Scroller />
        <Routes>         
           {/* User Routes with Layout */}
  <Route path="/" element={<UserLayout />}>
    <Route index element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/otp-verify" element={<OTPVerification />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/forgot-password-verify" element={<ForgotPasswordOtpVerification />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/collections/:collectionId" element={<CollectionPage />} />
    <Route path="/product/:id" element={<ProductDetails />} />

    {/*  Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
    </Route>
  </Route>
    

          {/* Admin Routes with Layout */}
          <Route element={<AdminProtectedRoutes/>}>
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="/admin/products/add" element={<AddProduct/>}/>
            <Route path="products/edit/:id" element={<ProductEditPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
          </Route>

          {/* Standalone Error Page - No Layout Wrapper */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
