import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
        },
        success: {
          iconTheme: {
            primary: "#1F4072",
            secondary: "#FFF3B4",
          },
        },
      }}
    />
  </StrictMode>
);
