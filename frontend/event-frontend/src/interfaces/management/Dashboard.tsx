import { useEffect, useMemo, useState } from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";

// Helper to format date (YYYY-MM-DD -> MM/DD/YYYY)
const fmtDate = (d?: string) => {
  if (!d) return "—";
  try {
    const date = new Date(d);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return d;
  }
};

export default function Dashboard() {
  // State for fallback diagnostics
  const [fallbackError, setFallbackError] = useState<string | null>(null);
  const [fallbackData, setFallbackData] = useState<any[]>([]);

  // SDK hook
  const {
    data: events,
    isLoading,
    error,
  } = useFrappeGetDocList<any>("Custom Event", {
    fields: ["name", "event_name", "description", "start_date", "end_date", "capacity", "venue"],
    orderBy: { field: "start_date", order: "desc" },
    limit: 100,
  });

  // Venues hook
  const { data: venues } = useFrappeGetDocList<any>("Venue", {
    fields: ["name", "venue_name"],
    limit: 200,
  });

  // Fallback direct fetch (diagnostics if SDK fails)
  useEffect(() => {
    const fetchFallback = async () => {
      try {
        const base = import.meta.env.VITE_FRAPPE_BASE_URL as string;
        const token = import.meta.env.VITE_FRAPPE_API_TOKEN as string;

        if (!base) {
          setFallbackError("No VITE_FRAPPE_BASE_URL set.");
          return;
        }
        if (!token) {
          setFallbackError("No VITE_FRAPPE_API_TOKEN set.");
          return;
        }

        const url = `${base.replace(/\/$/, "")}/api/resource/Custom%20Event?limit_page_length=10&fields=["name","event_name","start_date","end_date","status","venue"]`;

        // ✅ Ensure token has correct prefix
        const tokenTrim = token.trim();
        const authHeader = tokenTrim.toLowerCase().startsWith("token ")
          ? tokenTrim
          : `token ${tokenTrim}`;

        const res = await fetch(url, {
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          setFallbackError(`Fallback fetch failed: ${res.status} ${res.statusText}`);
          return;
        }

        const json = await res.json();
        setFallbackData(json.data || []);
      } catch (err: any) {
        setFallbackError("Fallback fetch threw error: " + err.message);
      }
    };

    if (error) {
      fetchFallback();
    }
  }, [error]);

  // Map venues
  const venueMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (Array.isArray(venues)) {
      venues.forEach((v) => {
        if (v.name && v.venue_name) map[v.name] = v.venue_name;
      });
    }
    return map;
  }, [venues]);

  const rows = events || fallbackData;

  return (
  <div className="page-wrap">
    <div className="app-container">
      <header className="mgmt-header">
        <h1 className="mgmt-title">Dashboard</h1>
        <div className="mgmt-subtitle">At-a-glance summary of events, bookings and venues</div>
      </header>

      {/* Optional KPI cards — hardcode or compute later */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">{rows?.length ?? 0}</div>
          <div className="kpi-label">Total Events</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">—</div>
          <div className="kpi-label">Total Bookings</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">—</div>
          <div className="kpi-label">Tickets Sold</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">—</div>
          <div className="kpi-label">Venues</div>
        </div>
      </div>

      <section className="section">
        <h3>All Events</h3>
        <div className="mgmt-subtitle">Comprehensive list of all events with details</div>

        {isLoading ? (
          <div style={{ padding: 18 }}>Loading…</div>
        ) : !rows || rows.length === 0 ? (
          <div style={{ padding: 18, color: "#6b7280" }}>No events found</div>
        ) : (
          <div className="table-wrap">
            <table className="m-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Dates</th>
                  <th>Capacity</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e: any, i: number) => (
                  <tr key={e.name ?? i}>
                    <td>{i + 1}</td>
                    <td>{e.event_name ?? e.custom_event_name ?? "—"}</td>
                    <td>{fmtDate(e.start_date)} → {fmtDate(e.end_date)}</td>
                    <td>{e.capacity ?? "—"}</td>
                    <td>{(venueMap as any)[e.venue] ?? e.venue ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  </div>
);
}