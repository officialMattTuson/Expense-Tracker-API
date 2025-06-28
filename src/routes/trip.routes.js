const express = require("express");
const Trip = require("../models/trip.model");
const Budget = require("../models/budget.model");
const router = express.Router();
// const axios = require("axios");

// Create an Trip
// router.post("/", async (req, res) => {
//   try {
//     const trip = new Trip(req.body);
//     await trip.save();
//     res.status(201).json(trip);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const {
      name,
      destination,
      startDate,
      endDate,
      currency,
      totalBudget,
      categoryBreakdown,
    } = req.body;

    // 1. Create the Trip
    const trip = new Trip({
      name,
      destination,
      startDate,
      endDate,
      budgets: [],
    });
    await trip.save();
    
    console.log("Creating budget");
    // 2. Create the Budget, linking to the Trip
    const budget = new Budget({
      name: `${name} Budget`,
      trip: trip._id,
      amount: totalBudget,
      currency,
      startDate,
      endDate,
      categoryBreakdown: categoryBreakdown.map((cb) => ({
        categoryId: cb.categoryId,
        amount: cb.amount,
      })),
    });
    await budget.save();

    // 3. Update the Trip to include the new budget
    trip.budgets.push(budget._id);
    await trip.save();

    res.status(201).json({ trip, budget });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Trip Details (including expenses)
router.get("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const expenses = await Expense.find({ tripId: req.params.tripId });
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({ trip, expenses, totalSpent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an Trip
router.put("/:id", async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an Trip
router.delete("/:tripId", async (req, res) => {
  try {
    const result = await Trip.findByIdAndDelete(req.params.tripId);
    if (!result) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:tripId/summary", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const expenses = await Expense.find({ tripId: req.params.tripId });
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Convert totalSpent to home currency
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${trip.destinationCurrency}`
    );
    const exchangeRate = response.data.conversion_rates[trip.homeCurrency];

    res.json({
      trip,
      totalSpent,
      totalSpentConverted: (totalSpent * exchangeRate).toFixed(2),
      exchangeRate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
