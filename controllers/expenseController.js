import mongoose from "mongoose";
import { Expense } from "../models/expenseModel.js"
import { User } from "../models/userModel.js";


// Get all expenses
const getExpenses = async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    const expenses = await Expense.find({user: user});
    res.json({
        "message": "Fetched all expenses!",
        "success": true,
        "expenses": expenses,
    });
}

// Create an expense
const createExpense = async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!req.body) {
        res.status(400).json({
            "message": "Invalid body!",
            "success": false,
        });
    }

    const {title, amount, category} = req.body;
    if (!title || !amount || !category) {
        return res.status(400).json({
            "message": "Some fields are missing!",
            "success": false,
        });
    }
    
    try {
        const expense = await Expense.create({
            title: title, 
            amount: amount, 
            category: category, 
            user: user
        });

        res.status(201).json({
            "message": "Expense created successfully!",
            "success": true,
            "expense": expense,
        });
    } catch(e) {
        res.status(500).json({
            "message": "Error creating expense...",
            "success": false,
        })
    }
}

// Get an expense
const getExpense = async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    const expenseId = req.params.expenseId;

    if (!mongoose.isValidObjectId(expenseId)) {
        return res.status(400).json({
            "message": "Invalid id!",
            "success": false,
        });
    }
    
    try {
        const expense = await Expense.findById(expenseId).findOne({user: user});
        if (!expense) {
            return res.status(404).json({
                "message": "Expense not found!",
                "success": false,
            });
        }
        console.log(expense);
        
        res.json({
            "message": "Fetched expense successfully!",
            "success": true,
            "expense": expense,
        });
    } catch(e) {
        console.error(e);
        res.status(500).json({
            "message": "Error fetching expense.",
            "success": false,
        });
    }
}

// Update an expense
const updateExpense = async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    const expenseId = req.params.expenseId;
    if (!mongoose.isValidObjectId(expenseId)) {
        return res.status(400).json({
            "message": "Invalid id!",
            "success": false,
        });
    }
    

    if (!req.body) {
        res.json({
            "message": "No update data provided!",
            "success": true,
        });
    }

    const {title, amount, category} = req.body;
    const updateData = {};
    if (title) updateData["title"] = title;
    if (amount) updateData["amount"] = amount;
    if (category) updateData["category"] = category;
    
    try {
        const expense = await Expense
            .findById(expenseId)
            .findOneAndUpdate({user: user}, updateData, {new: true});
        if (!expense) {
            return res.status(404).json({
                "message": "Expense not found!",
                "success": false,
            });
        }
        
        res.json({
            "message": "Updated expense successfully!",
            "success": true,
            "expense": expense,
        });
    } catch(e) {
        res.status(500).json({
            "message": "Error updating expense.",
            "success": false,
        });
    }
}

// Delete an expense
const deleteExpense = async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    const expenseId = req.params.expenseId;
    if (!mongoose.isValidObjectId(expenseId)) {
        return res.status(400).json({
            "message": "Invalid id!",
            "success": false,
        });
    }
    
    
    try {
        const expense = await Expense.findById(expenseId).findOneAndDelete({user: user});
        if (!expense) {
            return res.status(404).json({
                "message": "Expense not found!",
                "success": false,
            });
        }
        
        res.json({
            "message": "Deleted expense successfully!",
            "success": true,
            "expense": expense,
        });
    } catch(e) {
        res.status(500).json({
            "message": "Error deleting expense.",
            "success": false,
        });
    }
}

export {getExpenses, createExpense, getExpense, updateExpense, deleteExpense};
