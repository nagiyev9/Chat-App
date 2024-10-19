// Path 
import express from "express";

// Router
const router = express.Router();

// Import
import { getMessages, sendMessage } from "../controllers/message&conversation.controller.js";

router.get('/room/:id', getMessages);

router.post('/room/send-message/:id', sendMessage);

// router.put('/room/edit-message/:id/:mID', editMessage);

export default router;