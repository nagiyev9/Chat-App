// Path
import mongoose from "mongoose";

// Schema
const ConversationSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
        default: []
    }]
}, {
    timestamps: true
});

// Model
export const Conversation = mongoose.model('conversations', ConversationSchema);