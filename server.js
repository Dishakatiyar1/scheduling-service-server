const express = require("express");

const availabilityRouter = require("./src/routes/availability");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/availability", availabilityRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
