import React, { useState } from "react";
import {
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappeUpdateDoc,
  useFrappeDeleteDoc
} from "frappe-react-sdk";

export default function Venues() {
  const { data, isLoading, error, mutate } = useFrappeGetDocList<any>("Venue", {
    fields: ["name", "venue_name", "address", "capacity", "email", "phone"],
    limit: 200,
    orderBy: { field: "venue_name", order: "asc" },
  });

  const { createDoc, loading: creating } = useFrappeCreateDoc();
  const { updateDoc, loading: updating } = useFrappeUpdateDoc();
  const { deleteDoc, loading: deleting } = useFrappeDeleteDoc();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const [formData, setFormData] = useState({
    venue_name: "",
    address: "",
    capacity: 0,
    email: "",
    phone: "",
  });

  const rows = Array.isArray(data) ? data : [];

  const openModal = (venue?: any) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        venue_name: venue.venue_name || "",
        address: venue.address || "",
        capacity: venue.capacity || 0,
        email: venue.email || "",
        phone: venue.phone || "",
      });
    } else {
      setEditingVenue(null);
      setFormData({
        venue_name: "",
        address: "",
        capacity: 0,
        email: "",
        phone: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVenue(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVenue) {
        await updateDoc("Venue", editingVenue.name, formData);
      } else {
        await createDoc("Venue", formData);
      }
      await mutate();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save venue");
    }
  };

  const handleDelete = async (venueName: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    try {
      await deleteDoc("Venue", venueName);
      await mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to delete venue");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{JSON.stringify(error)}</div>;

  return (
    <div className="venues-section">
      <div className="venue-actions">
        <div>
          <h2 className="venues-title">Venues Management</h2>
          <div className="venues-subtitle">Add / edit venues here</div>
        </div>
        <div>
          <button
            onClick={() => openModal()}
            className="venue-btn"
            style={{ background: "#51bc8f", color: "#fff", border: "none" }}
          >
            Add Venue
          </button>
        </div>
      </div>

      <div className="venues-table-wrapper">
        <table className="venues-table" aria-live="polite">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Address</th>
              <th>Capacity</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v: any, i: number) => (
              <tr key={v.name || i}>
                <td>{i + 1}</td>
                <td>{v.venue_name}</td>
                <td>{v.address}</td>
                <td>{v.capacity}</td>
                <td>{v.email}</td>
                <td>{v.phone}</td>
                <td>
                  <button
                    onClick={() => openModal(v)}
                    className="venue-btn venue-edit"
                    disabled={updating || deleting}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.name)}
                    className="venue-btn venue-delete"
                    disabled={updating || deleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="venue-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="venue-modal" role="dialog" aria-modal="true" aria-label={editingVenue ? "Edit Venue" : "Add Venue"}>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>{editingVenue ? "Edit Venue" : "Add Venue"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Venue Name</label>
                <input
                  type="text"
                  required
                  value={formData.venue_name}
                  onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  style={{ minHeight: 80 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value || "0") })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" onClick={closeModal} className="venue-btn" style={{ border: "1px solid #e6e9ef" }}>Cancel</button>
                <button type="submit" className="venue-btn" style={{ background: "#51bc8f", color: "#fff", border: "none" }}>
                  {creating || updating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
