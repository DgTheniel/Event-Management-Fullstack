// Copyright (c) 2025, Your Company and contributors
// For license information, please see license.txt

frappe.ui.form.on('Event Booking', {
    refresh: function(frm) {
        // Add custom buttons or functionality here
        if (frm.doc.status === 'Pending') {
            frm.add_custom_button(__('Confirm Booking'), function() {
                frappe.call({
                    method: 'frappe.client.set_value',
                    args: {
                        doctype: 'Event Booking',
                        name: frm.doc.name,
                        fieldname: 'status',
                        value: 'Confirmed'
                    },
                    callback: function() {
                        frm.reload_doc();
                        frappe.show_alert(__('Booking confirmed successfully'));
                    }
                });
            });
        }
    },

    event: function(frm) {
        // Auto-fill event details if needed
        if (frm.doc.event) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Custom Event',
                    name: frm.doc.event
                },
                callback: function(data) {
                    if (data.message) {
                        // You can set additional fields here if needed
                        console.log('Event details loaded:', data.message);
                    }
                }
            });
        }
    }
});
