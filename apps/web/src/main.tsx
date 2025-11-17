import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Router } from "./common/router";
import { AuthProvider } from "./common/auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>,
);
