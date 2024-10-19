// Path
import express from "express";

// Router
const router = express.Router();

// Import
import { protectRoute } from "../middlewares/protectRoute.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import messageRouter from "./message.routes.js";

router.use('/auth', authRouter);
router.use('/user', protectRoute, userRouter);
router.use('/message', protectRoute, messageRouter);

export default router;