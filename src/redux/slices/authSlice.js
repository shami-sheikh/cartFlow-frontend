import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// retrive user info and token from localStroage if available
const userFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// check for existing guestId in the localStroage or generate a new one
const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

const initialState = {
  user: userFromLocalStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
  success: null,
  contactSuccess: false,
  profileLoading: false,
  updateProfileLoading: false,
  updateProfileError: null,
  updateProfileSuccess: false,
};

// async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data; // Return the entire response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// async thunk for user register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data; // Return the entire response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// async thunk for otp verify
export const otpVerify = createAsyncThunk(
  "auth/otpVerify",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/verify-account`,
        userData
      );
      return response.data; // { message, success, error }
    } catch (error) {
      // Return the entire error response data, not just the message
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

// Async thunk for resending OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/resend-otp`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to resend OTP" }
      );
    }
  }
);

// async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/forget-password`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

// async thunk for verify forgot password
export const verifyForgotPassword = createAsyncThunk(
  "auth/verifyForgotPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/verify-forget-password`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to verify OTP" }
      );
    }
  }
);

// asycn thunk for resend forgot password otp
export const resendForgotPasswordOtp = createAsyncThunk(
  "auth/resend-forgot-otp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/resend-forgot-password`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

// async thunk for reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reset password" }
      );
    }
  }
);

// async thunk for contact message
export const contactMessage = createAsyncThunk(
  "auth/contactMessage",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/contact`,
        contactData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || {
          message: "Failed to receive messages from user",
        }
      );
    }
  }
);

// Async thunk to fetch user profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch profile" }
      );
    }
  }
);

// Async thunk to update user profile (name, profileImage)
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Failed to update profile" }
      );
    }
  }
);

// create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
      state.error = null;
      state.loading = false;
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // access user from payload
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // otp verify
      .addCase(otpVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(otpVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || state.user;
        state.error = null;

        //  localStorage update
        if (action.payload?.user) {
          localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        }
      })
      .addCase(otpVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // resend otp
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Resend OTP failed";
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
      })

      // resend forgot password otp
      .addCase(resendForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendForgotPasswordOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Resend forgot OTP failed";
      })

      // verify forgot password
      .addCase(verifyForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // verify forgot password
      .addCase(verifyForgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || state.user;
        state.error = null;

        //  localStorage update
        if (action.payload?.user) {
          localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        }
      })
      .addCase(verifyForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Resend OTP failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success =
          action.payload?.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reset password";
      })

      // recive message
      .addCase(contactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.contactSuccess = false;
      })
      .addCase(contactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.contactSuccess = true;
      })
      .addCase(contactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // fetchProfile

      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.user = action.payload;
        state.updateProfileSuccess = true;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError =
          action.payload?.message || action.error.message;
        state.updateProfileSuccess = false;
      });
  },
});

export const { logout, generateNewGuestId, clearError } = authSlice.actions;
export default authSlice.reducer;
