const express = require("express");
const prisma = require("../prisma");

const availabilityRouter = express.Router();

availabilityRouter.post("/", async (req, res) => {
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

  return res.json({ message: "validation passed" });
});

module.exports = availabilityRouter;
