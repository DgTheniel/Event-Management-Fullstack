// src/interfaces/management/Events.tsx
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeDeleteDoc,
  useFrappePostCall,
} from "frappe-react-sdk";

type EventRow = {
  name?: string;
  custom_event_name?: string;
  event_name?: string;
  start_date?: string;
  end_date?: string;
  venue?: string;
  capacity?: number;
  description?: string;
};

const Events = forwardRef((props, ref) => {
  // NOTE: ensure custom_event_name is not requested from the server to avoid 417 error
  const { data, isLoading, error, mutate } = useFrappeGetDocList<EventRow>(
    "Custom Event",
    {
      fields: [
        "name",
        "event_name",
        "start_date",
        "end_date",
        "venue",
        "capacity",
        "description",
      ],
      limit: 200,
      orderBy: { field: "start_date", order: "desc" },
    }
  );

  // API hooks
  const { call: addEvent, loading: adding } = useFrappePostCall(
    "event_management.custom_event.add_event"
  );
  const { updateDoc, loading: updating } = useFrappeUpdateDoc();
  const { deleteDoc, loading: deleting } = useFrappeDeleteDoc();

  const rows = Array.isArray(data) ? data : [];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [form, setForm] = useState({
    custom_event_name: "",
    start_date: "",
    end_date: "",
    venue: "",
    capacity: 0,
    description: "",
  });

  const openModal = (row?: EventRow) => {
    if (row) {
      setEditing(row);
      setForm({
        custom_event_name: row.custom_event_name ?? row.event_name ?? "",
        start_date: row.start_date ?? "",
        end_date: row.end_date ?? "",
        venue: row.venue ?? "",
        capacity: row.capacity ?? 0,
        description: row.description ?? "",
      });
    } else {
      setEditing(null);
      setForm({
        custom_event_name: "",
        start_date: "",
        end_date: "",
        venue: "",
        capacity: 0,
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  // Expose openModal to parent (ManagementApp)
  useImperativeHandle(ref, () => ({
    openAddModal: () => openModal(),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        event_name: form.custom_event_name || undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        venue: form.venue || undefined,
        capacity: form.capacity || undefined,
        description: form.description || undefined,
      };

      if (editing && editing.name) {
        // Editing → use updateDoc
        await updateDoc("Custom Event", editing.name, payload);
      } else {
        // Creating → call backend API
        await addEvent(payload);
      }

      mutate(); // refresh list
      closeModal();
    } catch (err) {
      console.error("Failed to save event", err);
      alert("Failed to save event. See console for details.");
    }
  };

  const handleDelete = async (docname?: string) => {
    if (!docname) return;
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc("Custom Event", docname);
      mutate();
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Failed to delete event");
    }
  };

  if (isLoading)
    return <div className="mgmt-section">Loading events...</div>;
  if (error)
    return (
      <div className="mgmt-section" style={{ color: "red" }}>
        {JSON.stringify(error)}
      </div>
    );

  return (
    <section id="mgmt-events-inner" className="mgmt-section">
      <h3 style={{ marginTop: 6, marginBottom: 8 }}>All Events</h3>
      <div
        className="mgmt-subtitle"
        style={{ marginBottom: 12 }}
      >
        Comprehensive list of all events with details
      </div>

      <div className="mgmt-table-wrapper table-wrap">
        <table className="mgmt-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Name</th>
              <th>Dates</th>
              <th>Capacity</th>
              <th>Venue</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.name ?? idx}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 700 }}>
                  {r.custom_event_name ?? r.event_name ?? "—"}
                </td>
                <td>
                  {r.start_date ?? "—"} → {r.end_date ?? "—"}
                </td>
                <td>{r.capacity ?? "—"}</td>
                <td>{r.venue ?? "—"}</td>
                <td>
                  <button
                    onClick={() => openModal(r)}
                    className="mgmt-btn mgmt-btn-edit"
                    style={{ marginRight: 8 }}
                    disabled={updating}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.name)}
                    className="mgmt-btn mgmt-btn-delete"
                    disabled={deleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 20, textAlign: "center" }}
                >
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="mgmt-modal-backdrop">
          <div className="mgmt-modal">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h3 style={{ margin: 0 }}>
                {editing ? "Edit Event" : "Add Event"}
              </h3>
              <button onClick={closeModal} className="bm-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bm-form">
              <div>
                <label className="bm-label">Event Name</label>
                <input
                  className="input-field"
                  value={form.custom_event_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      custom_event_name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div>
                  <label className="bm-label">Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="bm-label">End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        end_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px",
                  gap: 8,
                }}
              >
                <div>
                  <label className="bm-label">Venue (docname)</label>
                  <input
                    className="input-field"
                    value={form.venue}
                    onChange={(e) =>
                      setForm({ ...form, venue: e.target.value })
                    }
                    placeholder="Venue docname (optional)"
                  />
                </div>
                <div>
                  <label className="bm-label">Capacity</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        capacity: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="bm-label">Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="bm-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bm-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bm-submit"
                  disabled={adding || updating}
                >
                  {adding || updating
                    ? "Saving..."
                    : editing
                    ? "Save Changes"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
});

export default Events;
