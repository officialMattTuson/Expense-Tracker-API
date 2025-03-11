const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true }, 
  homeCurrency: { type: String, required: true }, 
  destinationCurrency: { type: String, required: true }, 
});

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;
