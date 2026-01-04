const express = require("express");
const { prisma } = require("../prisma");

const availabilityRouter = express.Router();

availabilityRouter.post("/", async (req, res) => {
  try {
    const { hostId, startTime, endTime, slotDuration } = req.body;

    // 1. Basic presence check
    if (!hostId || !startTime || !endTime || !slotDuration) {
      return res.status(400).json({
        error: "hostId, startTime, endTime, and slotDuration are required",
      });
    }

    // 2. Parse times
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 3. Invalid date check
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use ISO UTC format" });
    }

    // 4. Logical time check
    if (end <= start) {
      return res.status(400).json({ error: "endTime must be after startTime" });
    }

    // 5. Slot duration check
    if (slotDuration <= 0) {
      return res
        .status(400)
        .json({ error: "slotDuration must be greatet than 0" });
    }

    // 6. host check
    const host = await prisma.user.findUnique({
      where: { id: hostId },
    });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    if (host.role !== "HOST") {
      return res
        .status(403)
        .json({ error: "Only hosts can create availability" });
    }

    const mergedAvailability = await prisma.$transaction(async (tx) => {
      // 1. find all overlapping availabilities
      const overlapping = await tx.availability.findMany({
        where: {
          hostId,
          AND: [{ startTime: { lte: end } }, { endTime: { gte: start } }],
        },
      });

      // 2. calculate merged intervals
      let mergedStart = start;
      let mergedEnd = end;

      for (const avail of overlapping) {
        if (avail.slotDuration !== slotDuration) {
          throw new Error("slotDuration mismatch with existing availability");
        }
        if (avail.startTime < mergedStart) {
          mergedStart = avail.startTime;
        }
        if (avail.endTime > mergedEnd) {
          mergedEnd = avail.endTime;
        }
      }

      // 3. delete overlapping rows (if any)
      if (overlapping.length > 0) {
        await tx.availability.deleteMany({
          where: {
            id: { in: overlapping.map((a) => a.id) },
          },
        });
      }

      // 4. create merged availability
      return tx.availability.create({
        data: {
          hostId,
          startTime: mergedStart,
          endTime: mergedEnd,
          slotDuration,
        },
      });
    });

    // const availability = await prisma.availability.create({
    //   data: {
    //     hostId,
    //     startTime: start,
    //     endTime: end,
    //     slotDuration,
    //   },
    // });

    return res.status(201).json({
      message: "Availability merged successfully",
      availability: mergedAvailability,
    });
  } catch (error) {
    console.error("create availability error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = availabilityRouter;
