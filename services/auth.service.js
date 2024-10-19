// Import
import { Auth } from "../models/auth.model.js";
import { User } from "../models/user.model.js";
import { logger } from "../middlewares/logger.js";

// Get User By Its Username
const getUserByUsername = async username => {
    try {
        return await Auth.findOne({ username: username });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Searching A User By Its Username
const searchUserByUsername = async (username, myUserName) => {
    try {
        return await Auth.find({
            $and: [
                { username: { $regex: username, $options: "i" } },
                { username: { $ne: myUserName } }
            ]
        });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Get User By Its Email
const getUserByEmail = async email => {
    try {
        return await Auth.findOne({ email: email });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Get User By Its ID
const getUserByID = async id => {
    try {
        return await Auth.findById(id);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Get User By Its Reset Token
const getUserByResetToken = async token => {
    try {
        return await Auth.findOne({ resetToken: token });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Signup
const signup = async auth => {
    try {
        return await new Auth(auth).save();
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Login
const login = async (username, email) => {
    try {
        return await Auth.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Close User Account Permanently
const closeAccount = async id => {
    try {
        return await Promise.all([Auth.findOneAndDelete({ _id: id }), User.findOneAndDelete({ user: id })]);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Update Password
const updatePassword = async (email, password) => {
    try {
        return await Auth.findOneAndUpdate(
            { email: email },
            password,
            { new: true, runValidators: true }
        );
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Reset Token
const saveAndResetToken = async (email, resetToken, resetTokenExpiration) => {
    try {
        const user = await getUserByEmail(email);

        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;

        await user.save();
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Clear Reset Token
const clearResetToken = async email => {
    try {
        const user = await getUserByEmail(email);

        user.resetToken = null;
        user.resetTokenExpiration = null;

        await user.save();
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

export default { getUserByUsername, searchUserByUsername, getUserByEmail, getUserByID, getUserByResetToken, signup, login, closeAccount, updatePassword, saveAndResetToken, clearResetToken };