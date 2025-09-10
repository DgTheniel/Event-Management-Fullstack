import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bookingSchema = z.object({
  attendee_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  tickets: z.number().min(1, "At least 1 ticket").max(10, "Max 10 tickets"),
});
type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BookingForm) => Promise<void> | void;
}

export default function BookingModal({ isOpen, onClose, onSubmit }: BookingModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { attendee_name: "", email: "", tickets: 1 },
  });

  if (!isOpen) return null;

  const submitHandler = async (data: BookingForm) => {
    try {
      if (onSubmit) await onSubmit(data);
      else console.log("Booking (no handler):", data);
      reset();
      onClose();
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. See console.");
    }
  };

  return (
    <div className="bm-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bm-modal" role="dialog" aria-modal="true" aria-label="Booking form">
        <div className="bm-header">
          <h3 className="bm-title">Book Tickets</h3>
          <button aria-label="Close" className="bm-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="bm-form">
          <div>
            <label className="bm-label">Name</label>
            <input {...register("attendee_name")} className="bm-input" />
            {errors.attendee_name && <div className="bm-err">{errors.attendee_name.message}</div>}
          </div>

          <div>
            <label className="bm-label">Email</label>
            <input {...register("email")} className="bm-input" />
            {errors.email && <div className="bm-err">{errors.email.message}</div>}
          </div>

          <div>
            <label className="bm-label">Tickets</label>
            <input type="number" {...register("tickets", { valueAsNumber: true })} min={1} max={10} className="bm-input" />
            {errors.tickets && <div className="bm-err">{errors.tickets.message}</div>}
          </div>

          <div className="bm-actions">
            <button type="button" onClick={() => { reset(); onClose(); }} className="bm-cancel">Cancel</button>
            <button type="submit" className="bm-submit" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
