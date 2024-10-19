// Import
import conversationService from "../services/conversation.service.js";
import messageService from "../services/message.service.js";
import userService from "../services/user.service.js";
import { getRecieverSocketID, io } from "../socket/socket.js";

// Get Messages 
export const getMessages = async (req, res) => {
    try {
        const { id: receiverID } = req.params;
        const { _id: senderID } = req.user;

        const sender = await userService.getUserInfoByUser(senderID);
        const reciever = await userService.getUserInfoByUser(receiverID);

        if (!reciever || !sender) {
            return res.status(404).json({ message: "User not found!" });
        };

        const checkConversation = await conversationService.getConversation(senderID, receiverID);

        if (!checkConversation) {
            return res.status(200).json([]);
        };

        const messages = checkConversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { id: receiverID } = req.params;
        const { _id: senderID } = req.user;
        const { message } = req.body;
        console.log(senderID);
        console.log(receiverID);

        const sender = await userService.getUserInfoByUser(senderID);
        const reciever = await userService.getUserInfoByUser(receiverID);

        if (!reciever || !sender) {
            return res.status(404).json({ message: "User not found!" });
        };

        if (!message || !message === " ") {
            return res.status(400).json({ message: "You can not send empty message!" });
        };

        let checkConversation = await conversationService.getConversation(senderID, receiverID);

        if (checkConversation === null) {
            checkConversation = await conversationService.createConversation({
                participants: [senderID, receiverID]
            });
        };

        const checkBlockList = sender.block_list.includes(reciever.user);
        const checkRecieverBlockList = reciever.block_list.includes(sender.user);
        console.log(sender.user);
        console.log(reciever.user);
        console.log(receiverID);
        console.log(sender.block_list);
        console.log(sender.block_list.includes(reciever.user));
        console.log(reciever.block_list);
        console.log(reciever.block_list.includes(sender.user));

        if (checkBlockList) {
            return res.status(400).json({ message: "You has been blocked this user!" });
        } else if (checkRecieverBlockList) {
            return res.status(400).json({ message: "This user has been blocked you!" });
        };

        const newMessage = await messageService.sendMessage({
            senderID,
            receiverID,
            message
        });

        if (newMessage) {
            checkConversation.messages.push(newMessage._id);
            await checkConversation.save();
        };

        const recieverSocketID = getRecieverSocketID(receiverID);

        if (recieverSocketID) {
            io.to(recieverSocketID).emit("newMessage", newMessage);
        };

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);
        res.status(500).json(error);
    };
};

// Edit Message
// export const editMessage = async (req, res) => {
//     try {
//         const { id: receiverID, mID: messageID  } = req.params;
//         const { _id: senderID } = req.user;

//         const sender = await userService.getUserInfoByUser(senderID);
//         const reciever = await userService.getUserInfoByUser(receiverID);


//     } catch (error) {
//         console.log(error);
//         // logger.error(error.message);
//         res.status(500).json(error);
//     };
// };