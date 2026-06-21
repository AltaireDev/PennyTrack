import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";


const JWT_SECRET = process.env.JWT_SECRET;

// Login Route
const handleLogin = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            "message": "Invalid body!",
            "success": false,
        });
    }
    console.log(req.body);
    console.log("=======================")

    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({
            "message": "Some fields are missing!", 
            "success": false
        });
    }

    try {
        // Fetch user
        const user = await User.findOne({username: username});
        console.log(user);

        if (!user) {
            return res.status(400).json({
                "message": "Invalid username!",
                "sucess": false,
            });
        }

        // Check password hash
        if (!bcrypt.compareSync(password, user.password)) {
            console.log(user.password, password);
            return res.status(400).json({
                "message": "Invalid password!",
                "success": false,
            });
        }

        // Login by generating jwt key...
        const userPayload = {
            userId: user._id,
        }
        const accessToken = jwt.sign(userPayload, JWT_SECRET, {
            expiresIn: "1h",
        });

        // Set a cookie
        res.cookie("accessToken", accessToken, {
            maxAge: 60 * 60 * 100,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        
        res.json({
            "message": "Logged in successfully!",
            "accessToken": accessToken,
            "success": true
        });
    } catch(e) {
        console.error(e);
        res.status(500).json({
            "message": "Error logging in",
            "success": false,
        });
    }
}

// Register Route
const handleRegister = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            "message": "Invalid body!",
            "success": false,
        });
    }

    const {username, email, location, password} = req.body;

    if (!username || !email || !password) {
        res.status(400).json({
            "message": "Some fields are missing!",
            "success": false,
        });
    }

    try {
        // Check for username uniqueness
        const existingUser = await User.findOne({username: username})
        if (existingUser) {
            res.status(400).json({
                "message": "User with this username already exists!",
                "success": false,
            });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create user
        const user = await User.create({
            username: username, 
            email: email, 
            location: location, 
            password: hashedPassword
        });

        res.status(201).json({
            "message": "User created successfully!",
            "success": true,
            "user": user,
        });
    } catch(e) {
        res.status(500).json({
            "message": "Error registering...",
            "success": false,
        });
    }
}

// Profile route
const handleGetProfile = async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        res.status(401).json({
            "message": "User not found!",
            "success": false,
        });
    }

    res.json({
        "message": "User fetched successfully!",
        "success": true,
        "user": user,
    });
}

// Logout Route
const handleLogout = (req, res) => {
    res.clearCookie("accessToken");
    res.json({
        "message": "Logged out successfully!",
        "success": true,
    });
}


export {handleLogin, handleRegister, handleGetProfile, handleLogout};
