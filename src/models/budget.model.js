const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  categoryBudgets: [
    {
      category: String,
      allocatedAmount: Number
    }
  ],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  isActive: { type: Boolean, default: false }
});

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget;
