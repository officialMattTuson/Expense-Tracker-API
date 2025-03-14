const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  currency: { type: String, required: true },
  date: { type: Date, default: Date.now },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, 
  budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" }
});
const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
