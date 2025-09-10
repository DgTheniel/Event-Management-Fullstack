import frappe
from frappe.model.document import Document
from frappe import _

class EventBooking(Document):
    def validate(self):
        # Ensure number_of_tickets is positive
        if self.number_of_tickets is not None and self.number_of_tickets <= 0:
            frappe.throw(_("Number of tickets must be greater than 0"))

        # Validate email format
        if self.email and not frappe.utils.validate_email_address(self.email):
            frappe.throw(_("Please enter a valid email address"))

        # Validate phone number (basic length check for 10-digit validation)
        if self.phone and len(self.phone) != 10:
            frappe.throw(_("Phone number must be exactly 10 digits"))

        # Check if event exists and has capacity
        if self.event:
            event = frappe.get_doc("Custom Event", self.event)
            if event.status != "Approved":
                frappe.throw(_("Cannot book tickets for an event that is not approved"))

            # Check capacity (this is a simple check, you might want more complex logic)
            existing_bookings = frappe.db.count("Event Booking", {"event": self.event, "status": "Confirmed"})
            if existing_bookings + self.number_of_tickets > event.capacity:
                frappe.throw(_("Not enough capacity available for this event"))

        # Status must be one of allowed options
        if self.status and self.status not in ["Pending", "Confirmed", "Cancelled"]:
            frappe.throw(_("Invalid status"))

    @staticmethod
    def get_permitted_fields():
        """Allow all fields in queries"""
        return ["name", "event", "attendee_name", "email", "phone", "number_of_tickets", "booking_date", "status"]
