import session from "express-session";

export const ExpressSession = session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
})