// Path
import jwt from "jsonwebtoken";

// Import
import { Auth } from "../models/auth.model.js";
import { logger } from "./logger.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided!" });
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided!" });
        };

        const user = await Auth.findById(decoded.userID).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        };

        req.user = user._id;
        next();
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    };
};