const express = require("express");
const router = express.Router();

const categories = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Education",
  "Entertainment",
  "Clothing",
  "Miscellaneous",
];

router.get("/", async (req, res) => {
  res.json(categories);
});

module.exports = router;
