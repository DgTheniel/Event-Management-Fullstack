import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Header from "../../components/Header";

export default function Public() {
  return (
    <div className="min-h-screen bg-publicBg">
      <Header />
      <div className="p-4">
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}
