// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchProvider } from "./context/SearchContext"; // ✅ import this

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SearchProvider>  {/* ✅ wrap App inside provider */}
      <App />
    </SearchProvider>
  </React.StrictMode>
);
