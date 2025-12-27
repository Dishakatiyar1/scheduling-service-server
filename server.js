const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  res.status(200).message({ status: "ok" });
});

app.listen(8000, () => {
  console.log("app running on the port 8000");
});
