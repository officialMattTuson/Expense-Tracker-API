require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expense.routes");
const reportsRoutes = require("./routes/reports.routes");
const categoriesRoutes = require("./routes/categories.routes");
const budgetRoutes = require("./routes/budget.routes");
const tripRoutes = require("./routes/trip.routes");
const exchangeRoutes = require("./routes/exchange.routes");
require("./jobs/recurring-expenses");

const app = express();
connectDB(); // Connect to MongoDB

app.use(cors());
app.use(bodyParser.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/exchange", exchangeRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to AI Expense Tracker Backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
