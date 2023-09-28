const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newExpenses = new Schema(
  {
    expenseName: {
      type: String,
      required: true,
    },
    expenseDate: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expenses = mongoose.model("Expenses", newExpenses);

module.exports = Expenses;