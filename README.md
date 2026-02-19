
# 📈 Trading Core - Frontend

A high-performance, responsive React frontend for a simulated stock trading and portfolio management platform. This application allows users to explore live market data, execute simulated trades, and track real-time portfolio performance including realized and unrealized PnL.

## 🚀 Live Deployment

The API is currently deployed and accessible at:
**[👉 Live API Endpoint](https://trading-core-frontend.onrender.com/auth)**



## ✨ Features

* **Secure Authentication Flow:** Robust JWT-based authentication utilizing a hybrid approach (HttpOnly cookies for session persistence + `localStorage` for fast Axios interceptor injection). Includes strict route guarding for protected dashboard areas.
* **Live Market Overview:** A paginated market explorer featuring live stock prices. Implements sequential fetching and request-throttling to gracefully handle third-party API rate limits without degrading the user experience.
* **Real-time Portfolio Tracking:** Dynamic tables and allocation charts that calculate Unrealized PnL (open positions) and Realized PnL (closed positions) based on live market quotes.
* **Order Management:** A dedicated trading terminal for placing Buy/Sell orders, complete with dynamic cash balance validation.
* **Optimized State Management:** Utilizes React Query for aggressive data caching, background refetching, and deduping network requests across complex component trees.


## 🛠️ Tech Stack

* **Framework:** React.js (via Vite)
* **Routing:** React Router v6 (Data Router approach)
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **State Management:** `@tanstack/react-query`, React Context API (Auth)
* **Forms & Validation:** React Hook Form + Zod
* **Network & API:** Axios (with custom request/response interceptors)
* **Data Visualization:** Recharts

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v16+) installed. You will also need the Trading Core Backend running locally.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/trading-core-frontend.git](https://github.com/yourusername/trading-core-frontend.git)
   cd trading-core-frontend

```

2. Install dependencies:
```bash
npm install

```


3. Configure Environment Variables:
Create a `.env.local` file in the root directory and add your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:5000/api

```


4. Start the development server:
```bash
npm run dev

```



## 🧠 Key Engineering Decisions

* **Bulletproof Variable Destructuring:** The portfolio components are designed to gracefully handle variations in backend payload structures (e.g., singular `holding` vs plural `holdings`), preventing UI crashes when dealing with nested API responses.
* **Rate-Limit Resilience:** The market data fetching logic incorporates a custom sequential sleep loop and localized price caching. This prevents the frontend from accidentally triggering `429 Too Many Requests` errors when users rapidly scroll through paginated stock lists.
* **Zombie Session Prevention:** The logout flow explicitly clears both frontend state (`localStorage`, Query Client) and commands the server to invalidate the `HttpOnly` cookie, guaranteeing a clean session wipe and preventing unauthorized cache viewing.

## 📂 Folder Structure

```text
src/
├── components/
│   ├── features/      # Feature-specific components (PortfolioTable, AllocationChart)
│   ├── layout/        # AppShell, Navbar, ProtectedRoute
│   └── ui/            # Reusable core UI (Card, Button, Input)
├── context/           # Global state (AuthContext)
├── hooks/             # Custom React hooks (usePortfolio, useMarket)
├── lib/               # Utility functions, constants, and Axios config
├── pages/             # Top-level route components (Dashboard, Market, AuthPage)
└── App.jsx            # Router configuration and global providers
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/yourusername/trading-core-frontend/issues).

## 📝 License

This project is licensed under the MIT License.

```

***

### A few quick tips before you commit:
1. Don't forget to replace `yourusername` in the clone link with your actual GitHub username.
2. It is highly recommended to take a screenshot of your beautiful `/dashboard` and `/portfolio` pages, place them in a `public/assets` folder, and add them to the top of the README using `![Dashboard Preview](/public/assets/dashboard.png)`. Visuals instantly hook recruiters!

**Would you like me to help you draft the `README.md` for your Node.js/Express Backend repository as well?**

```
