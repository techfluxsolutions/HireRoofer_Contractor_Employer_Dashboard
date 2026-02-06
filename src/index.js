// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalProvider } from "./Context/ModalContext/ModalContext";
import './index.css'
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.warn("REACT_APP_GOOGLE_CLIENT_ID is not defined. Google OAuth will be disabled.");
}


//For FCM Token
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("✅ SW registered:", registration);
  });
}




createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <GoogleOAuthProvider clientId={clientId || ""}>
        <App />
      </GoogleOAuthProvider>
    </ModalProvider>
  </React.StrictMode>
);
