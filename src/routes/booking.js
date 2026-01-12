const express = require("express");
const { prisma } = require("../prisma");

const bookingRouter = express.Router();

bookingRouter.post("/", async (req, res) => {
  try {
    const { hostId, userId, startTime, endTime } = req.body;

    if (!hostId || !userId || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    const booking = await prisma.$transaction(async (tx) => {
      // 1. Check overlapping booking
      const overlappingBooking = await tx.booking.findFirst({
        where: {
          hostId,
          AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
        },
      });

      if (overlappingBooking) {
        throw new Error("slot already booked");
      }

      // 2. Check availability coverage
      const availability = await tx.availability.findFirst({
        where: {
          hostId,
          startTime: { lte: start },
          endTime: { gte: end },
        },
      });

      if (!availability) {
        throw new Error("slot not within availability");
      }

      // 3. Validate slot duration
      const durationMinutes = (end - start) / (1000 * 60);
      if (durationMinutes !== availability.slotDuration) {
        throw new Error("Invalid slot duration");
      }

      // 4. Create booking
      return tx.booking.create({
        data: {
          userId,
          hostId,
          startTime: start,
          endTime: end,
        },
      });
    });

    return res.status(201).json({ booking });
  } catch (error) {
    if (
      error.message === "slot already booked" ||
      error.message === "slot not within availability" ||
      error.message === "Invalid slot duration"
    ) {
      return res.status(409).json({ error: error.message });
    }

    console.error("booking error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { bookingRouter };
