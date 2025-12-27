const express = require("express");

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/health", (req, res) => {
  res.status(200).message({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
