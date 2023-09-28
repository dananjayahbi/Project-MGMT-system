const router = require("express").Router();

const {
    addExpense,
    getAllExpenses,
    getExpense,
} = require("../controllers/expensesController");

//ADD NEW EXPENSE
router.post("/addExpense", addExpense);

//GET ALL EXPENSES
router.get("/getAllExpenses", getAllExpenses);

//GET AN EXPENSE
router.get("/getExpense/:id", getExpense);

module.exports = router;