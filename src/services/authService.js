import conf from "../conf/conf";
import axios from "axios";

export class AuthService {
  constructor() {
    this.API_BASE_URL = conf.backendUrl;
    this.AUTH_TOKEN_KEY = "auth_token";
  }

  // ✅ Register Patient (with ID Proof Upload)
  async register({ fullName, email, gender, age, idProof }) {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("gender", gender);
      formData.append("age", age);
      
      if (idProof) {
        formData.append("idProof", idProof);
      }
      
      const response = await axios.post(
        `${this.API_BASE_URL}/api/patient/register`, 
        formData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true // Enable cookies
        }
      );
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error.response?.data || "An error occurred";
    }
  }

  // ✅ Verify OTP (to complete login)
  async verifyOTP({ email, otp }) {
    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/api/patient/verify-otp`, 
        { email, otp },
        { withCredentials: true } // Enable cookies
      );
      
      // Store token in localStorage as a backup
      if (response.data && response.data.token) {
        this.storeToken(response.data.token);
        console.log("Token stored in localStorage");
      }
      
      return response.data;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error.response?.data || "Invalid OTP";
    }
  }

  // ✅ Request OTP for Login or Signup
  async requestOTP(email) {
    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/api/patient/login`, 
        { email },
        { withCredentials: true } // Enable cookies
      );
      return response.data;
    } catch (error) {
      console.error("OTP request failed:", error);
      throw error.response?.data || "Error requesting OTP";
    }
  }

  // ✅ Store token in localStorage (backup method)
  storeToken(token) {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  // ✅ Retrieve token from localStorage
  getToken() {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  // ✅ Fetch current user details - try cookie first, fall back to localStorage
  async getCurrentUser() {
    try {
      // First try with cookies (withCredentials)
      const response = await axios.get(
        `${this.API_BASE_URL}/api/patient/patient-profile/me`,
        { withCredentials: true }
      );
      
      return response.data.patient;
    } catch (cookieError) {
      // If cookie fails, try with localStorage token as fallback
      try {
        const token = this.getToken();
        
        if (!token) return null;
        
        const response = await axios.get(
          `${this.API_BASE_URL}/api/patient/patient-profile/me`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        return response.data.patient;
      } catch (error) {
        console.error("Fetching user failed:", error);
        
        if (error.response && error.response.status === 401) {
          this.logout();
        }
        
        return null;
      }
    }
  }
  
  // ✅ Check if user is authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // ✅ Logout (remove token and clear cookie)
  async logout() {
    try {
      // Call logout endpoint to clear the cookie
      await axios.post(
        `${this.API_BASE_URL}/api/patient/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear localStorage
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
  }
}

const authService = new AuthService();
export default authService;