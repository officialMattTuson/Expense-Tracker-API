const express = require("express");
const Budget = require("../models/budget.model");
const router = express.Router();

// Set a budget
router.post("/", async (req, res) => {
  try {
    const { amount, currency, startDate, endDate, categoryBudgets } = req.body;
    const budget = new Budget({ amount, currency, startDate, endDate, categoryBudgets });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single budget
router.get("/:budgetId", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.budgetId).populate("expenses");
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const totalSpent = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    res.json({ ...budget.toObject(), totalSpent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().populate("expenses");

    const budgetsWithTotalSpent = budgets.map(budget => {
      const totalSpent = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return { ...budget.toObject(), totalSpent };
    });

    res.json(budgetsWithTotalSpent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Budget Alert (Notify When Close to Limit)
router.get("/alerts", async (req, res) => {
  try {
    const budget = await Budget.findOne().sort({ _id: -1 });
    if (!budget) return res.status(404).json({ error: "No budget found." });

    const expenses = await Expense.find({
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = budget.amount - totalSpent;
    const alertThreshold = budget.amount * 0.8; 

    let alertMessage = null;
    if (totalSpent >= alertThreshold) {
      alertMessage = "⚠️ You have spent 80% or more of your budget!";
    }

    res.json({ totalBudget: budget.amount, totalSpent, remainingBudget, alertMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Category-wise Budget Report
router.get("/category-comparison", async (req, res) => {
  try {
    const budget = await Budget.findOne().sort({ _id: -1 });
    if (!budget) return res.status(404).json({ error: "No budget found." });

    const expenses = await Expense.find({
      date: { $gte: budget.startDate, $lte: budget.endDate }
    });

    let categoryComparison = budget.categoryBudgets.map((catBudget) => {
      const spent = expenses
        .filter(exp => exp.category === catBudget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);

      return {
        category: catBudget.category,
        allocated: catBudget.allocatedAmount,
        spent,
        remaining: catBudget.allocatedAmount - spent
      };
    });

    res.json(categoryComparison);
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

router.delete("/:budgetId", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.budgetId);
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    // If the budget being deleted is the active one, reset active budget
    if (budget.isActive) {
      await Budget.updateMany({}, { isActive: false });
    }

    await budget.deleteOne();
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/active", async (req, res) => {
  try {
    const activeBudget = await Budget.findOne({ isActive: true });

    if (!activeBudget) {
      return res.status(200).json({ message: "No active budget set", budget: null });
    }

    res.json(activeBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/set-active/:budgetId", async (req, res) => {
  try {
    const { budgetId } = req.params;
    const currentActive = await Budget.findOne({ isActive: true });

    // If the selected budget is already active, do nothing
    if (currentActive && currentActive._id.toString() === budgetId) {
      return res.status(200).json({ message: "Budget is already active", budget: currentActive });
    }

    // Unset any existing active budget
    await Budget.updateMany({}, { isActive: false });

    // Set the selected budget as active
    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      { isActive: true },
      { new: true }
    );

    if (!updatedBudget) return res.status(404).json({ message: "Budget not found" });

    res.json({ message: "Active budget updated", budget: updatedBudget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/event/:eventId", async (req, res) => {
  try {
    const budgets = await Budget.find({ event: req.params.eventId }).populate("expenses");
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
