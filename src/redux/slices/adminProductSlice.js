import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`;

//  Get all products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch products" }
      );
    }
  }
);

export const fetchAdminProductById = createAsyncThunk(
  "adminProducts/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/productDetails/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      // your backend returns: { success: true, product: {...} }
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch product details" }
      );
    }
  }
);

//  Add product
export const addAdminProduct = createAsyncThunk(
  "adminProducts/add",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add product" }
      );
    }
  }
);

//  Update product
export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/edits/${id}`, updates, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update product" }
      );
    }
  }
);

//  Delete product
export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to delete product" }
      );
    }
  }
);

//  Slice
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    productDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Fetch productdetail by ID
      .addCase(fetchAdminProductById.fulfilled, (state, action) => {
        state.productDetails = action.payload;
      })

      .addCase(addAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the product object (not { product })
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(addAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })

      // Delete product
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const {} = adminProductSlice.actions;
export default adminProductSlice.reducer;
