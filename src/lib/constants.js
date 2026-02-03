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
    SIGNUP: "/auth/sign-up", // FIXED: Matches backend
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  // ... keep USER object ...
  WALLET: {
    ROOT: "/user/wallet",
    ADD: "/user/wallet/add",
  },
  MARKET: {
    STOCKS: "/market/stocks",
    PRICE: (symbol) => `/market/price/${symbol}`, // FIXED: Matches backend
    HISTORY: (symbol) => `/market/history/${symbol}`,
  },
  ORDER: {
    BUY: "/order/buy",   // FIXED: Matches backend
    SELL: "/order/sell", // FIXED: Matches backend
    HISTORY: "/order/my", // FIXED: Matches backend
    CANCEL: (id) => `/order/${id}`, // FIXED: Backend uses DELETE /:id
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
