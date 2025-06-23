const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  destinations: [{type: String, required: true}],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }], 
});

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;
