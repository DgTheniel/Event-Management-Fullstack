import frappe
from frappe.model.document import Document
from frappe import _

class CustomEvent(Document):
    def validate(self):
        # Ensure capacity is positive
        if self.capacity is not None and self.capacity <= 0:
            frappe.throw(_("Capacity must be greater than 0"))

        # Check that end date is after start date
        if self.start_date and self.end_date and self.end_date < self.start_date:
            frappe.throw(_("End Date must be after Start Date"))

        # Status must be one of allowed options
        if self.status and self.status not in ["Draft", "Approved", "Rejected"]:
            frappe.throw(_("Status must be Draft, Approved, or Rejected"))

        # Venue must be linked (optional, only if you want mandatory check)
        if not self.venue:
            frappe.throw(_("Please select a Venue"))

    @staticmethod
    def get_permitted_fields():
        """Allow custom_event_name field in queries"""
        return [
            "custom_event_name",
            "name",
            "event_name",
            "start_date",
            "end_date",
            "venue",
            "capacity",
            "status",
            "organizer_email",
            "organizer_phone",
        ]


# ----------------------------
# Public API for frontend
# ----------------------------
@frappe.whitelist()
def add_event(event_name, start_date, end_date, venue=None, description=None, capacity=None):
    """Create a new Custom Event (callable from frontend via /api/method)"""
    doc = frappe.get_doc({
        "doctype": "Custom Event",
        "custom_event_name": event_name,
        "start_date": start_date,
        "end_date": end_date,
        "venue": venue,
        "description": description,
        "capacity": capacity or 0,
        "status": "Draft"
    })
    doc.insert()
    frappe.db.commit()
    return doc
