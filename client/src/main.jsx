import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

console.log("🔥 ROOT ENTRY LOADED");

// const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_ID ="771675860358-2mvpnql9dcvdpuerm82f9eptpkmkmgeo.apps.googleusercontent.com";

if (!GOOGLE_CLIENT_ID) {
  console.error("❌ GOOGLE CLIENT ID IS MISSING");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
