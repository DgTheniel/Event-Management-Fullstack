# Event Management System (Backend)

A **Frappe Framework-based Event Management System** to manage events, venues, and bookings efficiently, with full CRUD operations, validations, and relational links.

---

## Features

### Custom Event
- Create, view, edit, and delete events.
- **Fields include:** Event Name, Description, Start/End Dates, Venue, Capacity.
- **Validations:**
  - End Date must be after Start Date.
  - Event capacity cannot exceed venue capacity.
- Linked to venues for structured assignment.

### Venue
- Manage venues with: Venue Name, Address, Capacity, Email, Phone, Coordinates.
- **Validations:**
  - Capacity > 0.
  - Email format validation.
  - Phone must be 10 digits.
- Coordinates are optional for mapping integrations.

### Bookings
- Book events directly with attendee name, email, phone, number of tickets, and booking status.
- **Statuses:** Pending, Confirmed, Cancelled.

### System
- Fully functional CRUD interface via **Frappe Desk**.
- List views with filters for events, venues, and bookings.
- Built-in client-side validations.

---

## Installation

1. Clone the repository:

    git clone https://github.com/DgTheniel/Event-Management-Fullstack.git
    cd event_management_bench

2. Set up Frappe environment and site (see [Frappe Docs](https://docs.frappe.io/framework/user/en/installation)):

    bench --site your-site-name migrate
    bench start

3. Access the backend:

    http://localhost:8000

---

## Usage

- Add **venues** first.
- Create **events** linked to venues.
- Book events and manage attendee details.
- Use list view filters to sort events/bookings by date, venue, or capacity.
- Validations ensure data integrity.

---

## Tech Stack

- **Backend Framework:** Frappe Framework (Python)
- **Database:** MariaDB
- **Cache & Queue:** Redis
- **Web Server:** Node/Bench

---

## Screenshots

📌 Screenshots of DocTypes and list views are included in the `screenshots/` folder.

---

## Challenges Faced

- Creating custom DocTypes from scratch and linking relational fields.
- Validating event capacity with venue capacity.
- Handling booking statuses dynamically.

---

## Author

**DG Theniel**  
GitHub: [https://github.com/DgTheniel](https://github.com/DgTheniel)



===============================================================
# Event Management System (Frontend)

A **React + TypeScript + Vite frontend application** with dual-interface design:
- **Public Interface** for event discovery & booking.
- **Management Interface** for staff/organizers to manage events, venues, and bookings.

---

## Features

### Public Interface
- Visual event cards with **event name, venue, date, and booking option**.
- Search bar with live filtering by event name or venue.
- Booking modal with form validation (React Hook Form + Zod).
- Mobile-first responsive design.
- Color scheme:  
  - **Primary:** #B91C1C  
  - **Secondary:** #F59E0B  
  - **Background:** #FFFBF0  

### Management Interface
- Professional dashboard with analytics.
- CRUD tables for **events, venues, and bookings**.
- Approval workflows for events.
- Analytics section with KPIs (total events, approved events, total bookings, tickets sold).
- Color scheme:  
  - **Accent:** #51bc8f  
  - **Background:** #fcfcfd  

### Shared Features
- Interface switcher: Easily switch between **Public** and **Management** modes.
- State management using **Zustand**.
- Backend integration using **Frappe React SDK**.
- Reusable modals and styled components.

---

## Installation

1. Navigate to the frontend folder:

    cd frontend/event-frontend

2. Install dependencies:

    npm install

3. Create an environment file `.env.local`:

    VITE_FRAPPE_BASE_URL=http://localhost:8000
    VITE_FRAPPE_API_TOKEN=your_frappe_api_key:your_frappe_api_secret

4. Start development server:

    npm run dev

5. Open frontend at:

    http://localhost:5173

---

## Usage

- **Public Users:**
  - Search and browse events.
  - Book tickets directly.
- **Managers/Admins:**
  - Navigate to `/management`.
  - Manage events, venues, and bookings via dashboard.
  - View analytics on system performance.

---

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **State Management:** Zustand + TanStack Query
- **Backend Integration:** Frappe React SDK
- **UI Components:** Radix UI Primitives
- **Styling:** Tailwind CSS + Custom CSS
- **Forms & Validation:** React Hook Form + Zod
- **Routing:** React Router v6

---

## Screenshots

📌 Screenshots of Public Interface (Event Cards) and Management Dashboard are included in the `frontend/event-frontend/screenshot` folder.

---

## Challenges Faced

- Dual-interface structure with seamless switching.
- Fetching & mapping relational data (event → venue).
- Designing a professional dashboard UI while keeping the public interface consumer-friendly.
- Handling booking workflows with proper validation.

---

## Author

**DG Theniel**  
GitHub: [https://github.com/DgTheniel](https://github.com/DgTheniel)
