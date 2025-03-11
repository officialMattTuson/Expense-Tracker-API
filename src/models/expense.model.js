const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  currency: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  recurring: { type: Boolean, default: false },
  recurrenceInterval: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", default: null }, 
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
