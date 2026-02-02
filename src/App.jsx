import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";

// Optional wrapper if you ever want to embed the router directly.
export default function App() {
  return <RouterProvider router={router} />;
}

