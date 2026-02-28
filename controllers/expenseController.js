const Expense = require("../models/Expense");

// Add
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, note } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      note
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    expense.amount = req.body.amount || expense.amount;
    expense.category = req.body.category || expense.category;
    expense.note = req.body.note || expense.note;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Monthly Total
exports.getMonthlyTotal = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const expenses = await Expense.find({
      user: req.user._id,
      createdAt: { $gte: startOfMonth }
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ total });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Category Breakdown
exports.getCategoryTotals = async (req, res) => {
  try {
    const categoryTotals = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(categoryTotals);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};