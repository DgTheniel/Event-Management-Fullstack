import React, { useState } from "react";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeDeleteDoc,
} from "frappe-react-sdk";

export default function Bookings() {
  const { data, isLoading, error, mutate } = useFrappeGetDocList<any>(
    "Event Booking",
    {
      fields: [
        "name",
        "event",
        "attendee_name",
        "email",
        "phone",
        "number_of_tickets",
        "booking_date",
        "status",
      ],
      limit: 200,
      orderBy: { field: "booking_date", order: "desc" },
    }
  );

  const { updateDoc, loading: updating } = useFrappeUpdateDoc();
  const { deleteDoc, loading: deleting } = useFrappeDeleteDoc();

  const [statusFilter, setStatusFilter] = useState("All");

  const rows = Array.isArray(data) ? data : [];
  const filteredRows =
    statusFilter === "All"
      ? rows
      : rows.filter((b: any) => b.status === statusFilter);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  };

  const updateStatus = async (docname: string, newStatus: string) => {
    try {
      await updateDoc("Event Booking", docname, { status: newStatus });
      mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (docname: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteDoc("Event Booking", docname);
      mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
    }
  };

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div style={{ color: "red" }}>{JSON.stringify(error)}</div>;

  return (
    <section className="mgmt-section">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="mgmt-title">Bookings Management</h2>
          <div className="mgmt-subtitle">Manage event bookings</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mgmt-table-wrapper">
        <table className="mgmt-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Attendee</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tickets</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((b: any, i: number) => (
              <tr key={b.name}>
                <td>{i + 1}</td>
                <td>{b.event}</td>
                <td>{b.attendee_name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{b.number_of_tickets}</td>
                <td>{formatDate(b.booking_date)}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      b.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : b.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(b.name, "Confirmed")}
                        className="mgmt-btn mgmt-btn-primary mr-2 text-xs"
                        disabled={updating}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(b.name, "Cancelled")}
                        className="mgmt-btn mgmt-btn-delete mr-2 text-xs"
                        disabled={updating}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(b.name)}
                    className="mgmt-btn mgmt-btn-cancel text-xs"
                    disabled={deleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRows.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          No bookings found{" "}
          {statusFilter !== "All" ? `with status "${statusFilter}"` : ""}
        </div>
      )}
    </section>
  );
}
