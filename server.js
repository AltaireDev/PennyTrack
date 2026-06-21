import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/connect_db.js";
import authRouter from "./routes/authRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import cookieParser from "cookie-parser";

// App
const app = express();

// Constants
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

connectDB(MONGODB_URI);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Register routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", expenseRouter);

app.listen(PORT, () => {
    console.log("Server is up and running!");
});
