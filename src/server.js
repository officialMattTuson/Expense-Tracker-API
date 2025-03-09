const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expense.routes");
require("dotenv").config();

const app = express();
connectDB(); // Connect to MongoDB

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to AI Expense Tracker Backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
