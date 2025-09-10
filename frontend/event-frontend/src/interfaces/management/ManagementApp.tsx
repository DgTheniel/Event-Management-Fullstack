// src/interfaces/management/ManagementApp.tsx
import { useRef, type JSX } from "react";
import Events from "./Events"; // Events.tsx must be in the same directory

// small helper for dates (kept for compatibility)

export default function ManagementApp(): JSX.Element {
  // store a reference to Events child
  const eventsRef = useRef<{ openAddModal: () => void } | null>(null);

  const handleTopAddEvent = () => {
    if (eventsRef.current) {
      eventsRef.current.openAddModal(); // directly call child modal
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fcfcfd", padding: 24 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: 40, margin: 0, color: "#0b3a8c", fontWeight: 800 }}>
              Events Management
            </h1>
            <p style={{ color: "#6b7280", marginTop: 6, fontSize: 16 }}>
              View and manage events stored in Frappe
            </p>
          </div>

          <div>
            <button
              onClick={handleTopAddEvent}
              className="mgmt-btn-primary"
              style={{ padding: "10px 14px", borderRadius: 8, fontWeight: 700 }}
              aria-label="Top Add Event"
            >
              Add Event
            </button>
          </div>
        </div>

        {/* Events component mounted with ref */}
        <main id="mgmt-events-root">
          <Events ref={eventsRef} />
        </main>
      </div>
    </div>
  );
}
