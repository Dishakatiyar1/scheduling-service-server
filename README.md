# Event Booking & Availability System (Backend)

A backend-focused scheduling system built from scratch to understand how real booking systems work internally.

This project prioritizes correctness, time handling, and concurrency safety over UI or quick demos.

---

## What the System Does

- Hosts define availability as time ranges
- Availability is stored as intent, not pre-created slots
- Users book time within those ranges
- Backend enforces all business rules
- All time is stored and handled in UTC

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

---

## Core Design Principles

- **Store intent, not derived data**  
  Availability is stored as ranges. Slots are derived when needed.

- **Validate early**  
  Invalid time data is rejected before reaching the database.

- **Backend-first correctness**  
  Business rules are enforced in application logic and transactions.

- **Incremental development**  
  Features are added step by step to avoid hidden bugs.

---

## Database Models (High Level)

### User

- Represents both hosts and users
- Differentiated using a role enum (`HOST`, `USER`)
- Email is unique

### Availability

Represents a host’s available time window.

**Invariant**

> For each host, availability rows are always merged, non-overlapping intervals with a consistent slot duration.

- Stores start time, end time, and slot duration
- Overlapping or touching intervals are merged atomically
- Database never contains overlapping availability for a host

### Booking

Represents a confirmed booking.

- Stores exact booked time range
- Designed to be created using transactions
- Prevents double booking under concurrency

---

## API (Implemented)

### Create / Merge Availability

`POST /availability`

Creates availability for a host.  
If the new time range overlaps or touches existing availability, intervals are **merged atomically**.

**Request body:**

```json
{
  "hostId": "uuid",
  "startTime": "2025-01-01T10:00:00Z",
  "endTime": "2025-01-01T13:00:00Z",
  "slotDuration": 30
}
```

**Validations**

- Required fields must be present
- startTime and endTime must be Valid ISO UTC timestamps
- `endTime` must be greater than `startTime`
- `slotDuration` must be greater than 0
- hostId must belong to a user with role HOST
- slot duration must match existing availability for the host

**Behavior**

- Find all overlapping or touching availability intervals
- Merge them into a single normalized interval
- Deletes old rows and inserts the merged interval
- All operations are executed inside a database transaction

---

## What’s Not Implemented Yet

- Authentication and Authorization
- Slot persistence (slots will be derived dynamically)
- Booking creation API
- Double booking prevention logic
- Transaction isolation tuning
- Pagination and rate limiting
- indexing for faster query

---

### Why This Project Exists

Most booking systems fail due to:

- Incorrect time range modeling
- Storing derived data like slots
- Missing transactional guarantees
- Assuming "single user" means "no concurrency"

This project is built to experience and solve those failures, not hide them.

## Current Status

- PostgreSQL and Prisma configured (local developement)
- Database schema finalized
- Availability API implemented with:
  - strict input validation
  - host role checks
  - interval merging logic
  - transaction safety
- Availabilty data invariant at the write-time

---

## Next Steps

- Generate available slots dynamically from availability
- Implement booking creation using transactions
- Prevent double booking under concurrent requests
- Add authentication and role based authorization
- Prepare production safe migration and deployment flow
