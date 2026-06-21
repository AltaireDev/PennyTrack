import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export const loginRequired = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        res.status(401).json({
            "message": "No access token provided!",
            "success": false,
        });
    }

    const payload = jwt.verify(accessToken, JWT_SECRET);
    if (payload) {
        console.log(payload);
        req.userId = payload.userId;
        next();
    } else {
        res.status(401).json({
            "message": "Invalid access token!",
            "success": false,
        });
    }
}