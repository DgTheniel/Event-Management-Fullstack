// src/interfaces/management/index.tsx
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import ManagementApp from "./ManagementApp";
import Venues from "./Venues";
import Bookings from "./Bookings";
import Analytics from "./Analytics";

/**
 * Management index page
 * - DOES NOT render the top Header component (removes duplicate header)
 * - Renders the red "Event Management" header and a working switch button
 */

export default function Management() {
  const navigate = useNavigate();

  const handleSwitchToPublic = () => {
    // navigate to public interface root
    navigate("/public");
  };

  return (
    <div className="min-h-screen bg-managementBg page-wrap">
      {/* --- Only the red header (management header) remains here --- */}
      <div className="container app-container">
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <h1
            className="title"
            style={{ color: "var(--public-primary)", textDecoration: "underline", marginBottom: 12 }}
          >
            Event Management
          </h1>

          <div style={{ marginBottom: 18 }}>
            <button
              onClick={handleSwitchToPublic}
              className="btn-ghost"
              aria-label="Switch to Public"
              style={{ display: "inline-block", padding: "8px 12px", borderRadius: 6 }}
            >
              Switch to Public
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          {/* Left nav column */}
          <aside style={{ width: 220 }}>
            <h2 className="mgmt-title" style={{ marginTop: 0, marginBottom: 12 }}>Management</h2>
            <ul style={{ paddingLeft: 18, lineHeight: "2" }}>
              <li><a className="nav-link" href="/management">Dashboard</a></li>
              <li><a className="nav-link" href="/management/events">Events</a></li>
              <li><a className="nav-link" href="/management/venues">Venues</a></li>
              <li><a className="nav-link" href="/management/bookings">Bookings</a></li>
              <li><a className="nav-link" href="/management/analytics">Analytics</a></li>
            </ul>
          </aside>

          {/* Main content column */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<ManagementApp />} />
              <Route path="venues" element={<Venues />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
