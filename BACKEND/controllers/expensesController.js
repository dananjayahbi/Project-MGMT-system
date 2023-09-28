const Expenses = require("../models/Expenses.model");

//Add Expense
const addExpense = async (req, res) => {
    const {
        expenseName, 
        expenseDate,
        amount,
        description,
    } = req.body;

    // Check if user with the same expense already exists
    const existingExpense = await Expenses.findOne({
        $or: [{ expenseName: expenseName }],
    });
    if (existingExpense) {
        return res
        .status(400)
        .json({ error: "A Expense with the same name already exists" });
    }

    const expense = await Expenses.create({
        expenseName, 
        expenseDate,
        amount,
        description,
    });

    if (expense) {
        res.status(200);
        res.json("Expense added");
    } else{
        res.status(400);
        res.json("Adding Expense failed");
    }
};

//Get All Expenses
const getAllExpenses = async (req, res) => {
    const abc = await Expenses.find()
      .then((expenses) => {
        res.json(expenses);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get an Expense
const getExpense = async (req, res) => {
    try {
      const expenseObject = await Expenses.findById(req.params.id);
  
      if (!expenseObject) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      const {
        _id,
        expenseName, 
        expenseDate,
        amount,
        description,
      } = expenseObject;
  
      res.status(200).json({
        _id,
        expenseName, 
        expenseDate,
        amount,
        description,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

//Export
module.exports = {
    addExpense,
    getAllExpenses,
    getExpense
}