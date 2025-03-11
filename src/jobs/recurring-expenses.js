const cron = require("node-cron");
const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");

// Run job every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Running recurring expense job...");

  try {
    const today = new Date();

    // Find all recurring expenses
    const recurringExpenses = await Expense.find({ recurring: true });

    for (const expense of recurringExpenses) {
      let shouldGenerate = false;

      // Check if the expense should repeat today
      const lastGenerated = new Date(expense.date);
      if (expense.recurrenceInterval === "daily") {
        shouldGenerate = true;
      } else if (expense.recurrenceInterval === "weekly") {
        shouldGenerate = today - lastGenerated >= 7 * 24 * 60 * 60 * 1000;
      } else if (expense.recurrenceInterval === "monthly") {
        shouldGenerate = today.getMonth() !== lastGenerated.getMonth();
      }

      // If it's time to generate a new expense, create a new record
      if (shouldGenerate) {
        const newExpense = new Expense({
          amount: expense.amount,
          category: expense.category,
          currency: expense.currency,
          description: expense.description,
          date: today,
          recurring: false // Do not mark this one as recurring
        });

        await newExpense.save();
        console.log(`✅ Recurring expense added: ${expense.description}`);
      }
    }

  } catch (err) {
    console.error("❌ Error in recurring expense job:", err);
  }
});
