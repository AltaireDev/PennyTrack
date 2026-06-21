import express from "express";
import { loginRequired } from "../middleware/authMiddleware.js";
import {createExpense, deleteExpense, getExpense, getExpenses, updateExpense} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", loginRequired, getExpenses);
router.post("/", loginRequired, createExpense);
router.get("/:expenseId", loginRequired, getExpense);
router.put("/:expenseId", loginRequired, updateExpense);
router.delete("/:expenseId", loginRequired, deleteExpense);

export default router;
