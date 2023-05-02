const express = require("express");
const airplaneSeating = require("./airplaneSeating.js");

const app = express();
app.use(express.json());

app.post("/seating-plan", (req, res) => {
  const { rows, passengers } = req.body;

  if (!rows || !passengers) {
    return res.status(400).json({ error: "rows and passengers are required" });
  }

  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: "rows must be an array" });
  }

  if (typeof passengers !== "number") {
    return res.status(400).json({ error: "passengers must be a number" });
  }

  if (rows.length === 0) {
    return res.status(400).json({ error: "rows cannot be empty" });
  }

  const seatingPlan = airplaneSeating(rows, passengers);

  res.json(seatingPlan);
});

app.listen(3000, () => console.log("Server started on port 3000"));
