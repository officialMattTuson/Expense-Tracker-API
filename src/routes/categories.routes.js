const express = require("express");
const router = express.Router();

const categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Accommodation" },
  { id: 4, name: "Shopping" },
  { id: 5, name: "Activities" },
];

router.get("/", async (req, res) => {
  res.json(categories);
});

module.exports = router;
