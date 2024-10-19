// Path
import fs from "fs";

// Import
import userService from "../services/user.service.js";
import authService from "../services/auth.service.js";
import { logger } from "../middlewares/logger.js";

// Get My Informations
export const getMyInfo = async (req, res) => {
    try {
        const { _id } = req.user;

        const isExist = await userService.getUserInfoByUser(_id);

        if (!isExist) {
            return res.status(404).json({ message: "User not found!" });
        };

        res.status(200).json(isExist);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Get Other User Information
export const getUserInfo = async (req, res) => {
    try {
        const { userID } = req.params;

        const isExist = await userService.getUserInfoByUser(userID);

        if (!isExist) {
            return res.status(404).json({ message: "User not found!" });
        };

        res.status(200).json(isExist);
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Add Or Remove User From Blocklist
export const addOrRemoveUser = async (req, res) => {
    try {
        const { _id } = req.user;
        const secondID = req.params.id;

        const checkAuth = await userService.getUserInfoByUser(_id);
        const isExist = await userService.getUserInfoByUser(secondID);

        if (!checkAuth || !isExist) {
            return res.status(404).json({ message: "User not found" });
        };

        if (_id === secondID) {
            return res.status(400).json({ message: "You can not block yourself!" });
        };

        const isBlocked = checkAuth.block_list.includes(secondID);

        let blockList = checkAuth.block_list;

        if (isBlocked) {
            const blocked_user = blockList.indexOf(secondID);
            if (blocked_user > -1) {
                blockList.splice(blocked_user, 1); // Removes the user from the blocklist
            }
        } else {
            blockList.push(secondID); 
        };

        const changeBlockList = await userService.addOrRemoveUser(_id, {
            block_list: blockList
        });

        res.status(200).json({
            message: isBlocked ? "User removed from bloclist!" : "User blocked!",
            block_list: checkAuth.block_list
        });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};

// Edit User Infoformation
export const editUserInfo = async (req, res) => {
    try {
        const { _id } = req.user;
        const userInfo = req.body;
        
        let profilePic = req.body.profilePic;

        if (req.file) {
            profilePic = req.file.filename;

            fs.unlink("./public/profile pictures" + req.body.image, (err) => {
                console.log(err);
                // logger.error(err);
            });
        };

        const isExist = await userService.getUserInfoByUser(_id);

        if (!isExist) {
            return res.status(404).json({ message: "User not found!" });
        };

        await userService.editUserInfo(_id, userInfo);
        res.status(200).json({ message: "Datas updated successfully!" });
    } catch (error) {
        console.log(error);
        // logger.error(error.message);  
        res.status(500).json(error);
    };
};