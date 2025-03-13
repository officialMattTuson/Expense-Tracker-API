const express = require("express");
const Expense = require("../models/expense.model");
const Budget = require("../models/budget.model");
const router = express.Router();

// 1. Get Monthly Spending Report
router.get("/monthly", async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required." });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.json({ year, month, totalSpent, expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Category-wise Breakdown
router.get("/categories", async (req, res) => {
  try {
    const expenses = await Expense.find();
    const categoryBreakdown = {};

    expenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    res.json(categoryBreakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Compare Expenses to Budget
router.get("/budget-comparison", async (req, res) => {
  try {
    const budget = await Budget.findOne().sort({ _id: -1 });
    if (!budget) {
      return res.status(404).json({ error: "No budget found." });
    }

    const expenses = await Expense.find({
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = budget.amount - totalSpent;

    res.json({ totalBudget: budget.amount, totalSpent, remainingBudget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Expense Breakdown for a Trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId });
    const categoryBreakdown = {};

    expenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    res.json(categoryBreakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
