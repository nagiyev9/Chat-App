// Path
import express from "express";

// Router
const router = express.Router();

// Import
import { searchUser, signup, confirmAccount, login, logout, closeAccount, confirmCloseAccount, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { validate_register, validate_reset_password, handle_validation_errors } from "../middlewares/validation.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { limiter } from "../middlewares/limiter.js";

router.get('/search/user', protectRoute, searchUser);

router.post('/signup', [validate_register, handle_validation_errors], signup); 
router.post('/signup/confirm', limiter, confirmAccount);
router.post('/login', limiter, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', [validate_reset_password, handle_validation_errors], resetPassword);


router.delete('/close-account', protectRoute, closeAccount);
router.delete('/close-account/confirm', protectRoute, limiter, confirmCloseAccount);

export default router;