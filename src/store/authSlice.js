import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Request OTP
export const requestOTP = createAsyncThunk(
  "auth/requestOTP", 
  async (email, { rejectWithValue }) => {
    try {
      // Fix: Pass email directly as string instead of object, to match AuthService
      const response = await authService.requestOTP(email);
      return response;
    } catch (error) {
      // Handle error object properly
      return rejectWithValue(error?.message || error || "Failed to request OTP");
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP", 
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP({ email, otp });
      return response.user || response;
    } catch (error) {
      // Improved error handling
      return rejectWithValue(error?.message || error || "Failed to verify OTP");
    }
  }
);

// Register new user
export const register = createAsyncThunk(
  "auth/register", 
  async (userData, { rejectWithValue }) => {
    try {
      // Your AuthService expects specific fields, ensure they're passed correctly
      const response = await authService.register({
        fullName: userData.fullName,
        email: userData.email,
        gender: userData.gender,
        age: userData.age,
        idProof: userData.idProof || null
      });
      return response.user || response;
    } catch (error) {
      // Improved error handling
      return rejectWithValue(
        error?.response?.data?.message || 
        error?.message || 
        "Failed to register user"
      );
    }
  }
);

// Initial state
const initialState = {
  isAuthenticated: !!authService.getToken(),
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    logout: (state) => {
      authService.logout();
      localStorage.removeItem("auth_token");
      state.isAuthenticated = false;
      state.user = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP cases
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify OTP cases
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;