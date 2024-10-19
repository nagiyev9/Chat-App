// Path
import express from "express";

// Router
const router = express.Router();

// Import
import { getMyInfo, getUserInfo, addOrRemoveUser, editUserInfo } from "../controllers/user.controller.js";
import { ProfilePicUplaod } from "../utils/imageUpload.js";

router.get('/my-info', getMyInfo);
router.get('/info/:userID', getUserInfo);

router.put('/block/:id', addOrRemoveUser);
router.put('/edit/my-info', ProfilePicUplaod.single("profilePic"), editUserInfo);

export default router;