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
    const status = error?.response?.status;

    // Broadcast standardized app events so React can respond in a single place
    if (status === 401) {
      window.dispatchEvent(
        new CustomEvent("app:unauthorized", {
          detail: { message: error?.response?.data?.message },
        })
      );
    }

    if (status === 429) {
      // rate limit: include a retry hint (seconds)
      window.dispatchEvent(
        new CustomEvent("app:rate-limited", {
          detail: { retryAfter: 30 },
        })
      );
    }

    if (status === 500) {
      window.dispatchEvent(new CustomEvent("app:service-unavailable"));
    }

    return Promise.reject(error);
  }
);

export default api;

