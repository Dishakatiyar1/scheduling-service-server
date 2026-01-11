function generateSlots(startTime, endTime, slotDurationMinutes) {
  const slots = [];
  let current = new Date(startTime);

  while (
    current.getTime() + slotDurationMinutes * 60 * 1000 <=
    endTime.getTime()
  ) {
    const slotStart = new Date(current);
    const slotEnd = new Date(
      current.getTime() + slotDurationMinutes * 60 * 1000
    );

    slots.push({ startTime: slotStart, endTime: slotEnd });

    current = slotEnd;
  }

  return slots;
}

module.exports = { generateSlots };
