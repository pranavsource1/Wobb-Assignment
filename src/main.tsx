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
          background: "rgba(7, 20, 38, 0.92)",
          color: "#f7fbff",
          border: "1px solid rgba(191, 227, 247, 0.22)",
          borderRadius: "14px",
          fontSize: "14px",
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
          backdropFilter: "blur(18px)",
        },
        success: {
          iconTheme: {
            primary: "#83f2d1",
            secondary: "#071426",
          },
        },
      }}
    />
  </StrictMode>
);
