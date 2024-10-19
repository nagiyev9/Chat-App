// Path
import mongoose from "mongoose";
import { logger } from "../middlewares/logger.js";

// Connect
export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected');
    } catch (error) {
        logger.error(error.message);
    };
};