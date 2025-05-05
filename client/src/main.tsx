import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
