const express = require("express");

const availabilityRouter = require("./src/routes/availability");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/availability", availabilityRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
