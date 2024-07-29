import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "../src/contexts/AuthContext";
import { NextUIProvider } from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </AuthProvider>
);

reportWebVitals();
