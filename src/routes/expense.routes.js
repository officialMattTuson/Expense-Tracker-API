const express = require("express");
const Expense = require("../models/expense.model");
const router = express.Router();

// Add Expense
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();

    if (expense.recurring) {
      console.log(`Recurring expense added: ${expense.description}`);
      // We will later add a CRON job to auto-generate expenses
    }

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Expense
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Expense
// Update an existing expense
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,  // Find by ID
      req.body,       // Update with new data
      { new: true }   // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete Expense
router.delete("/:id", async (req, res) => {
  try {
    const result = await Expense.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Expenses for a Specific Trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Search Expenses
// Search for expenses based on query parameters

// router.get("/", async (req, res) => {
//   try {
//     const { category, startDate, endDate, minAmount, maxAmount, page = 1, limit = 10 } = req.query;

//     let filter = {};

//     if (category) filter.category = category;
//     if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     if (minAmount || maxAmount) filter.amount = { 
//       ...(minAmount && { $gte: Number(minAmount) }), 
//       ...(maxAmount && { $lte: Number(maxAmount) }) 
//     };

//     const expenses = await Expense.find(filter)
//       .sort({ date: -1 }) // Show latest expenses first
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


module.exports = router;
