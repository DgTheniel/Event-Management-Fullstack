import React, { useState } from "react";
import BookingModal from "./BookingModal";

interface EventCardProps {
  title: string;
  venue?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  event_docname?: string;
}

export default function EventCard({
  title,
  venue,
  description,
  start_date,
  end_date,
  event_docname,
}: EventCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <>
      <div className="card p-4 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-transform duration-300">
        <h3 className="text-lg font-semibold text-managementAccent mb-2 truncate">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        )}
        <div className="text-sm text-gray-700 mb-4">
          <div>
            <strong>Venue:</strong> {venue || "TBA"}
          </div>
          <div>
            <strong>Date:</strong> {formatDate(start_date)}{end_date ? ` - ${formatDate(end_date)}` : ""}
          </div>
        </div>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="btn-primary w-full py-2 font-semibold"
          aria-label={`Book tickets for ${title}`}
        >
          Book
        </button>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={async (data) => {
          // Stub handler
          console.log("Booking submitted", data);
          setIsBookingModalOpen(false);
        }}
      />
    </>
  );
}
