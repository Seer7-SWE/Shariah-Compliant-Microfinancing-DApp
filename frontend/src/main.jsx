import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Web3Provider } from "./context/Web3Context";
import "./style.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3Provider>
      <div className="app">
        <App />
      </div>
    </Web3Provider>
  </React.StrictMode>
);
