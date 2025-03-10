const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget;