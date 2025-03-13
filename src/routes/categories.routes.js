const express = require("express");
const router = express.Router();

const categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transportation" },
  { id: 3, name: "Housing" },
  { id: 4, name: "Utilities" },
  { id: 5, name: "Insurance" },
  { id: 6, name: "Healthcare" },
  { id: 7, name: "Education" },
  { id: 8, name: "Entertainment" },
  { id: 9, name: "Clothing" },
  { id: 10, name: "Miscellaneous" },
];

router.get("/", async (req, res) => {
  res.json(categories);
});

module.exports = router;
