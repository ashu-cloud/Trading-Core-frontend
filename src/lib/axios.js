import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true, // CRITICAL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let callers decide how to handle 401/403.
    // ProtectedRoute and AuthContext control navigation.
    return Promise.reject(error);
  }
);

export default api;

