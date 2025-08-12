// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootswatch/dist/solar/bootstrap.min.css"; // theme
import "./index.css";                              // your styles (if any)
import "./responsive.css";                         // ⬅️ our one-go responsive tweaks
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // navbar collapse, etc.


import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);