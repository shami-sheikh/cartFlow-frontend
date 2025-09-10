// src/redux/slices/checkoutSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/checkout`;

//  Create new checkout
export const createCheckout = createAsyncThunk(
  "checkout/create",
  async ({ checkoutItems, shippingAddress, paymentMethod, totalPrice }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(
        API_URL,
        {
          checkoutItems,
          shippingAddress: {
            fullName: shippingAddress.fullName || shippingAddress.name,
            email: shippingAddress.email,
            number: shippingAddress.number,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          paymentMethod,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to create checkout" });
    }
  }
);


//  Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  "checkout/createRazorpayOrder",
  async ({ checkoutId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/razorpay-order`,
        { checkoutId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to create Razorpay order" });
    }
  }
);

//  Verify Razorpay Payment
export const verifyRazorpayPayment = createAsyncThunk(
  "checkout/verifyPayment",
  async ({ checkoutId, razorpay_order_id, razorpay_payment_id, razorpay_signature }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/verify-payment`,
        { checkoutId, razorpay_order_id, razorpay_payment_id, razorpay_signature },
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to verify payment" });
    }
  }
);

//  Finalize Checkout -> Create Order
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalize",
  async ({ checkoutId }, { rejectWithValue }) => {
    try {
    
      const response = await axios.post(
        `${API_URL}/finalize/${checkoutId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to finalize checkout" });
    }
  }
);

//  Checkout Slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    razorpayOrder: null,
    order: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCheckoutState: (state) => {
      state.checkout = null;
      state.razorpayOrder = null;
      state.order = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload.checkout;
        state.success = true;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Razorpay Order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.razorpayOrder = action.payload.order;
        state.success = true;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Verify Payment
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload.checkout;
        state.success = true;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Finalize Checkout
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = true;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
