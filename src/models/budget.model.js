const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  total: { type: Number, required: true },
  amountTracking: { type: Number },
  currency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  categoryBudgets: [
    {
      category: String,
      allocatedAmount: Number,
    },
  ],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  isActive: { type: Boolean, default: false },
});

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget;
