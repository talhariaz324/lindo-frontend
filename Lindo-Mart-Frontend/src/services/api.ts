import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

// Create base API configuration
const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://lindo-mart-nest-production.up.railway.app/";

// Create axios instance with default config
export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Don't redirect to login if we're already on the login page
      const isLoginRequest = error.config?.url?.includes("/auth/login");

      switch (error.response.status) {
        case 401:
          // Only handle unauthorized and redirect for non-login requests
          if (!isLoginRequest) {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Error handler helper
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
  throw error;
};

export default api;
