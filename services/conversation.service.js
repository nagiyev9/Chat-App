// Import
import { Conversation } from "../models/conversation.model.js";

// Get Conversation
const getConversation = async (senderID, receiverID) => {
    return await Conversation.findOne({
        participants: { $all: [senderID, receiverID] }
    })
        .populate("participants")
        .populate("messages");
};

// Create New Conversation
const createConversation = async conversation => {
    return await Conversation.create(conversation);
};

export default { getConversation, createConversation };