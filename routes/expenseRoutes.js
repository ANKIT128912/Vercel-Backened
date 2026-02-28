const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getMonthlyTotal,
  getCategoryTotals
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

router.post("/add", protect, addExpense);
router.get("/", protect, getExpenses);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, updateExpense);
router.get("/monthly-total", protect, getMonthlyTotal);
router.get("/category-totals", protect, getCategoryTotals);

module.exports = router;