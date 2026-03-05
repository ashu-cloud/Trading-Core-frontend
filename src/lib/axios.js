import axios from "axios";

// In dev mode, use "/api" so the Vite proxy forwards to localhost:5000.
// In production, fall back to the deployed backend URL.
const BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? "/api" : "https://trading-core-backend.onrender.com/api");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Essential for the HttpOnly cookies used in your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ADDED: Request Interceptor to attach the localStorage token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attaches the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;

    // Prevent infinite loops if the check-auth endpoint itself fails
    if (originalRequest.url.includes("/auth/me") && status === 401) {
      return Promise.reject(error);
    }

    // Broadcast standardized app events
    if (status === 401) {
      window.dispatchEvent(
        new CustomEvent("app:unauthorized", {
          detail: { message: error?.response?.data?.message },
        })
      );
    }

    if (status === 429) {
      window.dispatchEvent(
        new CustomEvent("app:rate-limited", {
          detail: { retryAfter: 30 },
        })
      );
    }

    if (status === 500) {
      window.dispatchEvent(new CustomEvent("app:service-unavailable"));
    }

    // Network Error (Backend down)
    if (!error.response && error.code === "ERR_NETWORK") {
      console.error(`[Network Error] Could not connect to ${BASE_URL}. Is the backend running?`);
    }

    return Promise.reject(error);
  }
);

export default api;