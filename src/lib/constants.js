
// React Router (frontend)

export const ROUTES = {
  auth: "/auth",
  login: "/auth/login",
  dashboard: "/dashboard",
  market: "/market",
  orders: "/orders",
  portfolio: "/portfolio",
};

// Backend API endpoints

export const API = {
  AUTH: {
    SIGNUP: "/auth/sign-up", 
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
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
    BUY: "/order/buy",   
    SELL: "/order/sell", 
    HISTORY: "/order/my", 
    CANCEL: (id) => `/order/${id}`, 
    EXECUTE: (id) => `/order/execute/${id}`,
    LOGS: (id) => `/order/${id}/logs`,
  },
  PORTFOLIO: {
    ROOT: "/portfolio",
    ALLOCATION: "/portfolio/allocation",
  },
};

export const REFRESH_RATES = {
  marketPriceMs: 5000,
  ordersMs: 7000,
};