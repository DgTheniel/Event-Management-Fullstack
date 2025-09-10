import React, { useEffect, useMemo, useState } from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
import EventCard from "../../components/EventCard";

type EventType = any;
type VenueType = any;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // direct-fetch states (Code_B style: try direct fetch when VITE env present)
  const [fetchedEvents, setFetchedEvents] = useState<EventType[] | null>(null);
  const [fetchedVenues, setFetchedVenues] = useState<VenueType[] | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // keep original fallback (in case SDK needed)
  const [fallbackEvents, setFallbackEvents] = useState<EventType[] | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  // SDK hooks (still available as a fallback)
  const { data: sdkEvents, isLoading: sdkLoading, error: sdkError } = useFrappeGetDocList<any>(
    "Custom Event",
    {
      // removed custom_event_name to avoid "Field not permitted" error
      fields: ["name", "event_name", "venue", "start_date", "end_date", "description"],
      limit: 200,
      orderBy: { field: "start_date", order: "desc" },
    }
  );

  const { data: sdkVenues } = useFrappeGetDocList<any>("Venue", {
    fields: ["name", "venue_name"],
    limit: 500,
  });

  // -----------------------
  // Direct fetch (Code_B behavior)
  // -----------------------
  useEffect(() => {
    const base = import.meta.env.VITE_FRAPPE_BASE_URL;
    const token = import.meta.env.VITE_FRAPPE_API_TOKEN;

    // follow Code_B: if base exists, attempt direct fetch (no sdkError gating)
    if (!base) {
      // no base configured — skip direct fetch
      return;
    }

    // avoid refetching if already fetched or currently loading
    if (fetchedEvents !== null || fetchLoading) return;

    setFetchLoading(true);
    setFetchError(null);

    const baseTrimmed = base.replace(/\/$/, "");
    // safe fields list (no custom_event_name)
    const eventsUrl =
      `${baseTrimmed}/api/resource/Custom%20Event?limit_page_length=200&fields=["name","event_name","venue","start_date","end_date","description"]&order_by=start_date%20desc`;
    const venuesUrl = `${baseTrimmed}/api/resource/Venue?limit_page_length=500&fields=["name","venue_name"]`;

    const headers = token ? { Authorization: `token ${token}` } : undefined;

    Promise.all([fetch(eventsUrl, { headers }), fetch(venuesUrl, { headers })])
      .then(async ([resEv, resVen]) => {
        if (!resEv.ok) {
          const t = await resEv.text().catch(() => "");
          throw new Error(`Events fetch failed: ${resEv.status} ${resEv.statusText} ${t}`);
        }
        if (!resVen.ok) {
          const t = await resVen.text().catch(() => "");
          throw new Error(`Venues fetch failed: ${resVen.status} ${resVen.statusText} ${t}`);
        }
        const jsonEv = await resEv.json().catch(() => ({}));
        const jsonVen = await resVen.json().catch(() => ({}));
        const evData = Array.isArray(jsonEv?.data) ? jsonEv.data : [];
        const venData = Array.isArray(jsonVen?.data) ? jsonVen.data : [];
        setFetchedEvents(evData);
        setFetchedVenues(venData);
      })
      .catch((err) => {
        console.error("Direct fetch failed:", err);
        setFetchError(String(err.message ?? err));
      })
      .finally(() => setFetchLoading(false));
  }, [fetchedEvents, fetchLoading]);

  // -----------------------
  // Original fallback: only triggers if SDK errors (kept for safety)
  // -----------------------
  useEffect(() => {
    if (!sdkError) return; // only run when SDK reports error
    if (fallbackEvents !== null || fallbackLoading) return;

    const base = import.meta.env.VITE_FRAPPE_BASE_URL;
    const token = import.meta.env.VITE_FRAPPE_API_TOKEN;

    if (!base) {
      setFallbackError("Missing VITE_FRAPPE_BASE_URL in environment.");
      return;
    }

    setFallbackLoading(true);
    setFallbackError(null);

    const url =
      `${base.replace(/\/$/, "")}/api/resource/Custom%20Event?limit_page_length=200&fields=["name","event_name","venue","start_date","end_date","description"]`;

    fetch(url, {
      headers: token ? { Authorization: `token ${token}` } : undefined,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${text}`);
        }
        return res.json();
      })
      .then((json) => {
        const data = Array.isArray(json?.data) ? json.data : [];
        setFallbackEvents(data);
      })
      .catch((err) => {
        console.error("Fallback fetch failed:", err);
        setFallbackError(String(err.message ?? err));
      })
      .finally(() => setFallbackLoading(false));
  }, [sdkError, fallbackEvents, fallbackLoading]);

  // -----------------------
  // Decide source (priority: direct fetch -> SDK -> fallback)
  // -----------------------
  const events: EventType[] | null = fetchedEvents ?? sdkEvents ?? fallbackEvents;
  const venues: VenueType[] | null = fetchedVenues ?? sdkVenues ?? null;

  const loading = fetchLoading || sdkLoading || fallbackLoading;
  const error =
    (fetchError ? `Fetch: ${fetchError}` : null) ||
    (sdkError ? `SDK: ${String(sdkError)}` : null) ||
    (fallbackError ? `Fallback: ${fallbackError}` : null);

  // venue map (unchanged)
  const venueMap = useMemo(() => {
    const m: Record<string, string> = {};
    (venues ?? []).forEach((v: any) => {
      if (v && v.name) m[v.name] = v.venue_name ?? v.name;
    });
    return m;
  }, [venues]);

  // filtered list by search (unchanged)
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!searchTerm) return events;
    const q = searchTerm.toLowerCase();
    return events.filter((ev: any) => {
      const title = (ev.custom_event_name ?? ev.event_name ?? "").toString().toLowerCase();
      const venueName = (venueMap[ev.venue] ?? ev.venue ?? "").toString().toLowerCase();
      return title.includes(q) || venueName.includes(q);
    });
  }, [events, searchTerm, venueMap]);

  // -----------------------
  // UI (exact layout from Code_A)
  // -----------------------
  return (
    <div className="public-page container" style={{ paddingTop: 12, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 44, color: "#0b3a8c", margin: 0, fontWeight: 800 }}>Discover Amazing Events</h1>

        {/* Switch to Management (single working button) */}
        <div style={{ margin: "12px 0" }}>
          <a
            href="/management"
            className="mgmt-btn-primary"
            style={{ padding: "10px 14px", borderRadius: 8, fontWeight: 700, display: "inline-block" }}
            aria-label="Switch to Management"
          >
            Switch to Management
          </a>
        </div>

        <p style={{ color: "#374151", marginTop: 0 }}>Find and book tickets for the best events in your area</p>

        {/* search input (small icon only) */}
        <div style={{ maxWidth: 740, marginTop: 10, position: "relative" }}>
          <input
            type="text"
            placeholder="Search events by name or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
            style={{
              width: "100%",
              padding: "12px 14px 12px 44px",
              borderRadius: 10,
              border: "1px solid #e6e9ef",
              fontSize: 15,
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Events area */}
      <section style={{ marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h2 style={{ fontSize: 26, margin: 0 }}>Featured Events</h2>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            {loading ? "Loading…" : `${filteredEvents.length} event${filteredEvents.length !== 1 ? "s" : ""} found`}
          </div>
        </div>

        {/* Loading / Error handling */}
        {loading && <div style={{ padding: 20, color: "#374151" }}>Discovering amazing events...</div>}

        {!loading && error && (
          <div style={{ padding: 20, color: "#b91c1c" }}>
            Could not load events right now.
            <div style={{ marginTop: 6, color: "#6b7280" }}>{String(error)}</div>
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && <div style={{ padding: 20, color: "#374151" }}>No events found.</div>}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {!loading &&
            !error &&
            filteredEvents.map((ev: any) => {
              const title = ev.custom_event_name ?? ev.event_name ?? "Untitled Event";
              const venueName = venueMap[ev.venue] ?? ev.venue ?? "TBA";
              return (
                <div key={ev.name} style={{ background: "#fff", border: "1px solid #e6e9ef", padding: 14, borderRadius: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{title}</h3>
                  <div style={{ color: "#6b7280", marginTop: 8, fontSize: 13 }}>
                    <div>
                      <strong>Venue:</strong> {venueName}
                    </div>
                    <div>
                      <strong>Date:</strong> {ev.start_date ?? "—"}
                      {ev.end_date ? ` — ${ev.end_date}` : ""}
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <EventCard
                      title={title}
                      venue={venueName}
                      description={ev.description}
                      start_date={ev.start_date}
                      end_date={ev.end_date}
                      event_docname={ev.name}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
