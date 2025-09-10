import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import FrappeWrapper from "./lib/frappe";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FrappeWrapper>
      <AppRouter />
    </FrappeWrapper>
  </React.StrictMode>
);
