// ==========================
// React Router (frontend)
// ==========================
export const ROUTES = {
  auth: "/auth",
  login: "/auth/login",
  dashboard: "/dashboard",
  market: "/market",
  orders: "/orders",
  portfolio: "/portfolio",
};

// ==========================
// Backend API endpoints
// ==========================
export const API = {
  AUTH: {
    SIGNUP: "/auth/sign-up", // FIXED
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  // ... USER ...
  WALLET: {
    ROOT: "/user/wallet",
    ADD: "/user/wallet/add",
  },
  MARKET: {
    STOCKS: "/market/stocks",
    PRICE: (symbol) => `/market/price/${symbol}`,
    HISTORY: (symbol) => `/market/history/${symbol}`,
  },
  ORDER: {
    BUY: "/order/buy",   // FIXED: Split into BUY/SELL
    SELL: "/order/sell", // FIXED
    HISTORY: "/order/my", // FIXED
    CANCEL: (id) => `/order/${id}`, // FIXED: Removed /cancel/
    EXECUTE: (id) => `/order/execute/${id}`,
    LOGS: (id) => `/order/${id}/logs`,
  },
  PORTFOLIO: {
    ROOT: "/portfolio",
    ALLOCATION: "/portfolio/allocation",
  },
};
// ==========================
// React Query refresh policy
// ==========================
export const REFRESH_RATES = {
  marketPriceMs: 5000,
  ordersMs: 7000,
};
