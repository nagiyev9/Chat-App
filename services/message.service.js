// Import
import { Message } from "../models/message.model.js";

// Get Messages
const getMessages = async (senderID, receiverID) => {
    return await Message.find({
        $all: [
            { senderID: senderID },
            { receiverID: receiverID }
        ]
    })
        .populate("senderID")
        .populate("receiverID");
};

// Get Message By ID
const getMessageByID = async messageID => {
    return await Message.findOne({ _id: messageID });
};

// Send Message
const sendMessage = async message => {
    return await new Message(message).save();
};

// Edit Message
// const editMessage = async (id, message) => {
//     return await Message.findByIdAndUpdate(
//         id,
//         message,
//         { new: true, runValidators: true }
//     );
// };

export default { getMessages, getMessageByID, sendMessage };