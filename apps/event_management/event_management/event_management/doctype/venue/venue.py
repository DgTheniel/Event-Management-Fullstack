import frappe
from frappe.model.document import Document
from frappe import _

class Venue(Document):
    def validate(self):
        # Ensure capacity is positive
        if self.capacity is not None and self.capacity <= 0:
            frappe.throw(_("Capacity must be greater than 0"))

        # Validate email format (if filled)
        if self.email and not frappe.utils.validate_email_address(self.email):
            frappe.throw(_("Please enter a valid email address"))

        # Validate phone number (basic length check)
        if self.phone and (len(self.phone) < 7 or len(self.phone) > 15):
            frappe.throw(_("Please enter a valid phone number"))


# ----------------------------
# Public API for frontend
# ----------------------------
@frappe.whitelist()
def add_venue(venue_name, address=None, capacity=0, email=None, phone=None):
    """Create a new Venue (callable from frontend via /api/method)"""
    doc = frappe.get_doc({
        "doctype": "Venue",
        "venue_name": venue_name,
        "address": address,
        "capacity": capacity,
        "email": email,
        "phone": phone,
    })
    doc.insert()
    frappe.db.commit()
    return doc
