# Event Booking & Availability System (Backend)

This project is a backend-focused scheduling system built from scratch to understand how real booking systems work internally.

The goal of this project is not UI or fast demos. It is to learn how backend systems handle time, enforce business rules, and avoid common problems like invalid data and double booking.

---

What This System Does

- Hosts define when they are available using time ranges
- Availability is stored as ranges, not pre-created slots
- Users will later be able to book time within those ranges
- The backend is responsible for correctness, not the database alone

All time is handled and stored in UTC.

---

Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

---

Core Design Principles

- Store intent, not derived data  
  Availability is stored as time ranges. Slots are derived later.

- Validate early  
  Invalid time data is rejected before it reaches the database.

- Backend-first correctness  
  Business rules are enforced in application logic and transactions.

- Step-by-step development  
  Features are added gradually to avoid hidden bugs.

---

Database Overview

User

- Represents both hosts and users
- Differentiated using a role enum (HOST, USER)
- Email is unique

Availability

- Represents a host’s available time window
- Stores start time, end time, and slot duration in minutes

Booking

- Represents a confirmed booking
- Stores exact booked time range
- Designed to later prevent double booking using transactions

---

API Endpoints

Create Availability (In Progress)
POST /availability

Request Body:
{
"hostId": "uuid",
"startTime": "2025-01-01T10:00:00Z",
"endTime": "2025-01-01T13:00:00Z",
"slotDuration": 30
}

Validations Implemented

- All required fields must be present
- startTime and endTime must be valid ISO timestamps
- endTime must be strictly after startTime
- slotDuration must be greater than zero

These validations ensure invalid time data never enters the system.

---

What Is Not Implemented Yet

- Authentication
- Role-based authorization
- Saving availability to the database
- Booking creation
- Double booking prevention
- Transaction handling
- Concurrency safety

These will be added step by step.

---

Why This Project Exists

This project focuses on real backend problems:

- Time range validation
- Availability modeling
- Safe database writes
- Preventing race conditions
- Designing systems that behave correctly under load

The goal is understanding why things break and how to prevent that.

---

Current Status

Active development

- Database schema finalized
- Prisma and PostgreSQL configured
- Availability API validation implemented
- Authorization and persistence coming next

---

Next Steps

- Validate that only HOST users can create availability
- Store availability in the database
- Add overlap checks for availability ranges
- Implement booking creation with transaction-based double booking prevention

