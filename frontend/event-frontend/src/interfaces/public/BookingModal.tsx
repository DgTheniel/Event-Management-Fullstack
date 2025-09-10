import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFrappeCreateDoc } from "frappe-react-sdk";
import * as Dialog from "@radix-ui/react-dialog";
// Temporarily replace lucide-react icon with text
// import { X } from "lucide-react";

const bookingSchema = z.object({
  attendee_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  number_of_tickets: z.number().min(1, "At least 1 ticket required").max(10, "Maximum 10 tickets allowed"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDocname: string;
  eventTitle: string;
}

export default function BookingModal({ isOpen, onClose, eventDocname, eventTitle }: BookingModalProps) {
  const { createDoc, loading, error } = useFrappeCreateDoc();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      attendee_name: "",
      email: "",
      phone: "",
      number_of_tickets: 1,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createDoc("Event Booking", {
        event: eventDocname,
        attendee_name: data.attendee_name,
        email: data.email,
        phone: data.phone,
        number_of_tickets: data.number_of_tickets,
        booking_date: new Date().toISOString().split('T')[0],
        status: "Confirmed",
      });
      alert("Booking successful!");
      onClose();
      reset();
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-md mx-4">
          <Dialog.Title className="text-lg font-bold mb-4">Book Tickets for {eventTitle}</Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register("attendee_name")}
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-publicPrimary"
              />
              {errors.attendee_name && <p className="text-red-500 text-sm mt-1">{errors.attendee_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-publicPrimary"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-publicPrimary"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of Tickets</label>
              <input
                {...register("number_of_tickets", { valueAsNumber: true })}
                type="number"
                min="1"
                max="10"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-publicPrimary"
              />
              {errors.number_of_tickets && <p className="text-red-500 text-sm mt-1">{errors.number_of_tickets.message}</p>}
            </div>

            {error && <div className="text-red-500 text-sm">{JSON.stringify(error)}</div>}

            <div className="flex gap-2 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-publicPrimary text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
