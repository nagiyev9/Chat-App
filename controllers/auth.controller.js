// Path
import bcrypt from "bcrypt";
import crypto from "crypto";

// Import
import authService from "../services/auth.service.js";
import { logger } from "../middlewares/logger.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import { transporter } from "../utils/sendMail.js";
import { generateConfirmCode } from "../utils/generateConfirmCode.js";
import { signupMessage } from "../utils/messages/signup-message.js";
import { closeAccountMessage } from "../utils/messages/close-account-message.js";
import { isNotExist, resetPasswordMessage } from "../utils/messages/forgot-password.js";

// Search User By Its Username
export const searchUser = async (req, res) => {
    try {
        const username = req.query.username;
        const { _id } = req.user;

        const myUserName = await authService.getUserByID(_id);
        const isExist = await authService.searchUserByUsername(username, myUserName.username);

        if (isExist.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        };

        const userData = isExist.map((user) => ({
            name: user.name,
            surname: user.surname,
            username: user.username
        }));

        res.status(200).json(userData);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Signup
export const signup = async (req, res) => {
    try {
        const { name, surname, email, username, gender, password } = req.body;

        const isEmailExist = await authService.getUserByEmail(email);
        const isUsernameExist = await authService.getUserByUsername(username);

        if (isEmailExist || isUsernameExist) {
            return res.status(400).json({ message: isEmailExist ? "This email registered before" : "This username already taken" });
        };

        const confirmationCode = generateConfirmCode();

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Account Conformation',
            html: signupMessage(name, surname, confirmationCode)
        });

        req.session.unConfirmedUser = { name, surname, email, username, gender, password };
        req.session.confirmCode = confirmationCode;

        res.status(200).json({
            status: 200,
            message: 'Confirmation code has been sent your email!'
        });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Confirm Account
export const confirmAccount = async (req, res) => {
    try {
        const { confirmCode } = req.body;
        const confirmationCode = req.session.confirmCode;

        if (!confirmCode || !confirmationCode) {
            return res.status(400).json({ message: confirmCode === undefined ? "Please write confirmation code!" : "Confirmation code failed!" });
        };

        if (confirmCode !== confirmationCode) {
            return res.status(400).json({ message: "Confirm code is not correct!" });
        };

        const unConfirmedUser = req.session.unConfirmedUser;

        if (!unConfirmedUser) {
            return res.status(404).json({ message: "No Data!" });
        };

        const { name, surname, email, username, gender, password } = unConfirmedUser;

        const hashedPassword = await bcrypt.hash(password, 10);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await authService.signup({
            name,
            surname,
            email,
            username,
            gender,
            password: hashedPassword,
        });

        await new User({
            user: newUser._id,
            profilePic: newUser.gender === "male" ? boyProfilePic : girlProfilePic
        }).save();

        await req.session.destroy(err => {
            if (err) {
                console.log(err);
                // logger.error(err);
            };
        });

        res.status(201).json({
            status: 201,
            message: "Account confirmed and user registered successfully! You may login."
        });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Login 
export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if ((!email && !password) || (!username && !password)) {
            return res.status(400).json({ message: "Pleae fill all fields!" });
        };

        const isExist = await authService.login(username, email);
        const isPasswordCorrect = await bcrypt.compare(password, isExist !== null ? isExist.password : "");

        if (!isExist || !isPasswordCorrect) {
            return res.status(404).json({ message: email ? "Email Or Password is not correct!" : "Username or password is not correct" });
        };

        generateTokenAndSetCookie(isExist._id, res);

        res.status(200).json({
            status: 200,
            message: "Login successfull!"
        });

    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Logout
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            status: 200,
            message: "Logged out successfully!"
        });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Close User Account Permanently
export const closeAccount = async (req, res) => {
    try {
        const { _id } = req.user;

        const isExist = await authService.getUserByID(_id);

        if (!isExist) {
            return res.status(404).json({ message: "User not found!" });
        };

        const confirmCode = generateConfirmCode();

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: isExist.email,
            subject: 'Remove Account',
            html: closeAccountMessage(isExist.name, isExist.surname, confirmCode)
        });

        req.session.confirmCode = confirmCode;

        res.status(200).json({ message: "The confirm code has been sent to your email address" });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Confirm Close Your Acoount
export const confirmCloseAccount = async (req, res) => {
    try {
        const { _id } = req.user;
        const { confirmationCode } = req.body;
        const confirmCode = req.session.confirmCode;

        if (!_id) {
            return res.status(403).json({ message: "Could not found token!" });
        };

        if (!confirmationCode || !confirmCode) {
            return res.status(400).json({ message: confirmationCode === undefined ? "Please write confirmation code!" : "Confirmation code failed!" })
        };

        if (confirmationCode !== confirmCode) {
            return res.status(400).json({ message: "Invalid confirmation code!" });
        };

        await authService.closeAccount(_id);
        res.cookie("jwt", "", { maxAge: 0 })
        await req.session.destroy(err => {
            if (err) {
                console.log(err);
                // logger.error(err);
            };
        });;

        res.status(200).json({ message: "Account removed successfully!" });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Forgot Password 
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Pleasae write valid email!" });
        };

        const isExist = await authService.getUserByEmail(email);

        if (!isExist) {
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Forgot Password',
                html: isNotExist()
            });
            return;
        };

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 36000000 // 1 hour expiration

        await authService.saveAndResetToken(email, resetToken, resetTokenExpiration);

        const url = `http://localhost:4545/api/auth/reset-password?token=${resetToken}`;

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Forgot Password',
            html: resetPasswordMessage(url)
        });

        res.status(200).json({ message: "Password reset email has been sent! Check your inbox." });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        const user = await authService.getUserByResetToken(token);

        if (!user || user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        };

        const checkPasswordSame = await bcrypt.compare(newPassword, user.password);

        if (checkPasswordSame) {
            return res.status(400).json({ message: "New password can not be same old password!" });
        };

        const hashNewPassowrd = await bcrypt.hash(newPassword, 10);

        await authService.updatePassword(user.email, {
            password: hashNewPassowrd
        }); // Update password
        await authService.clearResetToken(user.email); // Clear reset token after update password successfully

        res.status(200).json({ message: "Password has been reset successfully!" });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};