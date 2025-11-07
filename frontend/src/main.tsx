// src/main.tsx
import ReactDOM from "react-dom/client"; // Only ReactDOM needed
import App from "./App";
import "./index.css";
import { SearchProvider } from "./context/SearchContext"; // ✅ context wrapper

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SearchProvider>
    <App />
  </SearchProvider>
);
