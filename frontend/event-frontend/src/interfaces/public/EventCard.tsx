import React, { useState } from "react";
import BookingModal from "./BookingModal";

export default function EventCard({
  title,
  venue,
  description,
  start_date,
  end_date,
  event_docname,
}: {
  title: string;
  venue?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  event_docname?: string;
}) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const isFeatured = title?.toLowerCase().includes("weekend concert");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <>
      <div className={`card p-4 transition-all duration-300 hover:shadow-xl hover:scale-102 bg-gradient-to-br from-white to-corporateGray-50 border-2 border-corporateGray-200 ${
        isFeatured ? "border-corporateAccent bg-gradient-to-br from-corporateBlue-50 to-corporateGray-100" : ""
      }`}>
        {isFeatured && (
          <div className="flex items-center mb-4">
            <span className="bg-corporateAccent text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              FEATURED
            </span>
          </div>
        )}

        <h3 className="text-xl md:text-2xl font-semibold text-corporateBlue-700 mb-3 leading-tight">{title}</h3>

        {description && (
          <p className="text-corporateGray-600 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">{description}</p>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-corporateGray-700">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-corporateBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm md:text-base font-medium">{venue || "Venue TBA"}</span>
          </div>

          <div className="flex items-center text-corporateGray-700">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-corporateBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm md:text-base font-medium">
              {formatDate(start_date)}{end_date ? ` → ${formatDate(end_date)}` : ""}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="btn-primary w-full text-base md:text-lg py-3 font-semibold"
        >
          Book Now
        </button>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        eventDocname={event_docname || ""}
        eventTitle={title}
      />
    </>
  );
}
