import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/general.css";
import "./styles/style.css";
import "./styles/queries.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
