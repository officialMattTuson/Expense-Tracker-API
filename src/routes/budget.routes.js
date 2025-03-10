const express = require("express");
const Budget = require("../models/budget.model");
const router = express.Router();

// Set a budget
router.post("/", async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single budget
router.get("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update budget

router.put("/:id", async (req, res) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete budget

router.delete("/:id", async (req, res) => {
  try {
    const result = await Budget.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
