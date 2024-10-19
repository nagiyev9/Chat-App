// Path
import { transports, createLogger, format } from "winston";
import dotenv from "dotenv";
import "winston-mongodb";

const { combine, timestamp, prettyPrint } = format;

dotenv.config();

// Logger
export const logger = createLogger({
    format: combine(
        timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.MongoDB({
            level: "error",
            db: process.env.MONGO_URI,
            collection: "server_logs"
        })
    ]
});