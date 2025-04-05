import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in dev mode
});

export default store;
