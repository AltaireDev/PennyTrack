import express from "express";
import { 
    handleLogin, 
    handleRegister, 
    handleLogout, 
    handleGetProfile 
} from "../controllers/authController.js";
import { loginRequired } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.get("/profile", loginRequired, handleGetProfile);
router.post("/logout", loginRequired, handleLogout);

export default router;

