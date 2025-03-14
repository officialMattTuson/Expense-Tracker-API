const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }], 
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
