const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: Date, default: Date.now },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
  location: {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
    },
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
