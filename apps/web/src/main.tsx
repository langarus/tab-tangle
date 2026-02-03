import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Router } from "./common/router";
import { AuthProvider } from "./common/auth";
import { ThemeProvider } from "./common/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
