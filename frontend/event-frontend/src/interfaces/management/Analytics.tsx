import React from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";

export default function Analytics() {
  const { data: events, isLoading: eventsLoading } = useFrappeGetDocList<any>("Custom Event", {
    fields: ["name", "status"],
    limit: 1000,
  });

  const { data: bookings, isLoading: bookingsLoading } = useFrappeGetDocList<any>("Event Booking", {
    fields: ["name", "status", "number_of_tickets"],
    limit: 1000,
  });

  const { data: venues, isLoading: venuesLoading } = useFrappeGetDocList<any>("Venue", {
    fields: ["name"],
    limit: 1000,
  });

  if (eventsLoading || bookingsLoading || venuesLoading) {
    return <div className="mgmt-section">Loading analytics...</div>;
  }

  const totalEvents = events?.length ?? 0;
  const approvedEvents = events?.filter((e: any) => e.status === "Approved").length ?? 0;
  const totalBookings = bookings?.length ?? 0;
  const confirmedBookings = bookings?.filter((b: any) => b.status === "Confirmed").length ?? 0;
  const totalTickets = bookings?.reduce((s: number, b: any) => s + (b.number_of_tickets ?? 0), 0) ?? 0;
  const totalVenues = venues?.length ?? 0;

  const metrics = [
    { key: "total_events", title: "Total Events", value: totalEvents, tone: "blue" },
    { key: "approved_events", title: "Approved Events", value: approvedEvents, tone: "green" },
    { key: "total_bookings", title: "Total Bookings", value: totalBookings, tone: "amber" },
    { key: "confirmed_bookings", title: "Confirmed Bookings", value: confirmedBookings, tone: "indigo" },
    { key: "total_tickets", title: "Total Tickets Sold", value: totalTickets, tone: "red" },
    { key: "total_venues", title: "Total Venues", value: totalVenues, tone: "violet" },
  ];

  return (
    <section className="mgmt-section">
      <h2 className="mgmt-title">Analytics</h2>
      <div className="mgmt-subtitle">At-a-glance metrics for events, bookings and venues</div>

      <div className="analytics-grid" role="list">
        {metrics.map((m) => (
          <div key={m.key} className="analytics-card" role="listitem">
            <div className={`analytics-pill analytics-${m.tone}`}>{m.value}</div>
            <div className="analytics-meta">
              <div className="analytics-title">{m.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mgmt-section" style={{ marginTop: 18 }}>
        <div className="mgmt-title" style={{ fontSize: 18, marginBottom: 8 }}>Quick Insights</div>
        <div className="analytics-insights">
          <div>
            <div className="text-sm text-gray-600">Event Approval Rate</div>
            <div className="text-2xl font-bold text-green-600">
              {totalEvents > 0 ? Math.round((approvedEvents / totalEvents) * 100) : 0}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Booking Confirmation Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
