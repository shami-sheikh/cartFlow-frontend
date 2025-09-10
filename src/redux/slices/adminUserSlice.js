// src/redux/slices/adminUserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`;

//  Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "adminUsers/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch users" }
      );
    }
  }
);

//  Add new user
export const addUser = createAsyncThunk(
  "adminUsers/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add user" }
      );
    }
  }
);

//  Update user
export const updateUser = createAsyncThunk(
  "adminUsers/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update user" }
      );
    }
  }
);

//  Delete user
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to delete user" }
      );
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      //  Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      //  Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex((user)=> user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser 
        }
      })

      //  Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { clearAdminUserError } = adminUserSlice.actions;
export default adminUserSlice.reducer;
