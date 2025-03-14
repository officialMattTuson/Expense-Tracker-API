const express = require("express");
const Event = require("../models/event.model");
const router = express.Router();
// const axios = require("axios");

// Create an Event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Event Details (including expenses)
router.get("/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const expenses = await Expense.find({ eventId: req.params.eventId });
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({ event, expenses, totalSpent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an Event
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an Event
router.delete("/:eventId", async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.eventId);
    if (!result) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:eventId/summary", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const expenses = await Expense.find({ eventId: req.params.eventId });
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Convert totalSpent to home currency
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${event.destinationCurrency}`);
    const exchangeRate = response.data.conversion_rates[event.homeCurrency];

    res.json({
      event,
      totalSpent,
      totalSpentConverted: (totalSpent * exchangeRate).toFixed(2),
      exchangeRate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
