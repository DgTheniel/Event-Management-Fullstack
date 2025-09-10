import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Management from "./interfaces/management";
import Public from "./interfaces/public";
import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/public" replace />} />
        <Route path="/public/*" element={<Public />} />
        <Route path="/management/*" element={<Management />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}