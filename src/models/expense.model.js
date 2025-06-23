const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: Date, default: Date.now },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
  location: {
    name: { type: String },
    city: { type: String },
    country: { type: String },
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
