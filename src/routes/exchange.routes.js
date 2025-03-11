const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const EXCHANGE_API = "https://v6.exchangerate-api.com/v6";
const API_KEY = process.env.EXCHANGE_API_KEY;

// Get exchange rate between two currencies
router.get("/convert/:from/:to/:amount", async (req, res) => {
  try {
    const { from, to, amount } = req.params;
    const response = await axios.get(
      `${EXCHANGE_API}/${API_KEY}/latest/${from}`
    );
    const rate = response.data.conversion_rates[to];

    if (!rate) return res.status(400).json({ error: "Invalid currency pair" });

    res.json({
      from,
      to,
      originalAmount: amount,
      convertedAmount: (amount * rate).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

module.exports = router;
