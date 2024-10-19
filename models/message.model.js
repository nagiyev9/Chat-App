// Path
import mongoose from "mongoose";

// Schema
const MessageSchema = mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Model
export const Message = mongoose.model('messages', MessageSchema);