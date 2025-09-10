
// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/orders`;

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        orderData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to create order" }
      );
    }
  }
);


//  Fetch logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await axios.get(`${API_URL}/my-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch my orders" }
      );
    }
  }
);

//   Fetch order details by ID
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch order details" }
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    orderDetails: null,
    totalOrders:0,
    loading: false,
    error: null,
    createOrderLoading: false,
    createOrderError: null,
    createOrderSuccess: false,
    createdOrder: null,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
    setCreatedOrder: (state, action) => {
      state.createdOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.createOrderLoading = true;
        state.createOrderError = null;
        state.createOrderSuccess = false;
        state.createdOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderSuccess = true;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderError = action.payload?.message || action.error.message;
        state.createOrderSuccess = false;
      })
      //  Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      //  Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearOrderDetails , setCreatedOrder} = orderSlice.actions;
export default orderSlice.reducer;
