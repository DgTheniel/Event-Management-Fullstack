import React from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";

const fmtDate = (d?: string) => {
  if (!d) return "—";
  try {
    const date = new Date(d);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return d;
  }
};

export default function PublicApp() {
  const { data: events, isLoading, error } = useFrappeGetDocList<any>("Custom Event", {
    fields: ["name", "event_name", "description", "start_date", "end_date", "capacity", "venue"],
    limit: 20,
    orderBy: { field: "start_date", order: "asc" },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-publicPrimary"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <div className="text-red-500 text-lg mb-4 font-semibold">Error loading events</div>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    </div>
  );

  const list = events ?? [];

  // find Weekend Concert if exists
  const weekend = list.find((e: any) => (e.event_name ?? "").toLowerCase().includes("weekend concert"));

  return (
    <div className="min-h-screen bg-publicBg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-publicPrimary mb-2">Public Event Interface</h1>
          <p className="text-gray-700 text-lg">Discover and book events.</p>
        </div>

        {weekend && (
          <div className="mb-6 p-4 rounded-lg bg-white border-2 border-publicSecondary">
            <strong className="text-publicPrimary font-semibold">Featured: {weekend.event_name}</strong>
            <div className="mt-1 text-sm text-gray-600">Date: {fmtDate(weekend.start_date)} — {fmtDate(weekend.end_date)}</div>
            <div className="text-sm text-gray-600">Venue: {weekend.venue ?? "—"}</div>
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          {list.length === 0 ? (
            <div className="text-center py-16 w-full">
              <div className="text-6xl mb-4">🎪</div>
              <div className="text-gray-500 text-xl mb-2 font-semibold">No events to show.</div>
              <p className="text-gray-400">Check back later for exciting events!</p>
            </div>
          ) : (
            list.map((e: any) => (
              <div key={e.name} className="w-64 rounded-lg p-4 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                <div className="font-bold text-publicPrimary">{e.event_name}</div>
                <div className="text-sm text-gray-600 mt-1">{e.description ?? ""}</div>
                <div className="text-sm mt-2">Date: {fmtDate(e.start_date)}</div>
                <div className="text-sm">Venue: {e.venue ?? "—"}</div>
                <button className="mt-4 w-full bg-publicSecondary text-white py-2 rounded hover:bg-yellow-600 transition-colors">
                  Book
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

