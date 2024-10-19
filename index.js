// Path
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

// Port
const PORT = process.env.PORT || 4545;

// Import
import { connect } from "./database/db.js";
import { logger } from "./middlewares/logger.js";
import { app, server } from "./socket/socket.js";
import { ExpressSession } from "./middlewares/session.js";
import MainRouter from "./routes/index.routes.js";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(ExpressSession); // Session
app.use(cookieParser()); // Cookie
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use('/api', MainRouter);

// Server Listen
server.listen(PORT, () => {
    try {
        connect();
        console.log(`Server is working on ${PORT} port`);
    } catch (error) {
        logger.log(error.message)
    };
});