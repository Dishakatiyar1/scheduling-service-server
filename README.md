Event Booking & Availability System (Backend)

A backend-focused scheduling system built from scratch to understand how real booking systems work internally.

This project prioritizes correctness, time handling, and concurrency safety over UI or quick demos.

What the System Does

Hosts define availability as time ranges

Availability is stored as intent, not pre-created slots

Users book time within those ranges

Backend enforces all business rules

All time is stored and handled in UTC

Tech Stack

Node.js

Express.js

PostgreSQL

Prisma ORM

Core Design Principles

Store intent, not derived data
Availability is stored as ranges. Slots are derived when needed.

Validate early
Invalid time data is rejected before reaching the database.

Backend-first correctness
Business rules are enforced in application logic and transactions.

Incremental development
Features are added step by step to avoid hidden bugs.

Database Models (High Level)
User

Represents both hosts and users

Differentiated using a role enum (HOST, USER)

Email is unique

Availability

Host’s available time window

Stores start time, end time, and slot duration

Booking

Represents a confirmed booking

Stores exact booked time range

Designed for transaction-based double booking prevention

API (Current)
Create Availability

POST /availability

Request body:

{
  "hostId": "uuid",
  "startTime": "2025-01-01T10:00:00Z",
  "endTime": "2025-01-01T13:00:00Z",
  "slotDuration": 30
}


Validations

Required fields present

Valid ISO timestamps

endTime must be greater than startTime

slotDuration must be greater than 0

What’s Not Implemented Yet

Authentication

Booking creation

Double booking prevention

Transaction handling

Concurrency safety

Why This Project

This project focuses on real backend problems:

Time range modeling

Safe database writes

Preventing race conditions

Designing systems that behave correctly under concurrency

The goal is to understand why systems break and how to prevent that.

Current Status

Database schema finalized

PostgreSQL and Prisma configured

Availability API implemented

Booking and transaction logic in progress

Next Steps

Implement booking creation

Prevent overlapping bookings using transactions

Handle concurrency safely

Add authentication and authorization
