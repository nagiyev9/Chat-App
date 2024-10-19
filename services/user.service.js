// Import
import { User } from "../models/user.model.js";

// Get User Info By User
const getUserInfoByUser = async user => {
    return await User.findOne({ user: user });
};

// Add Or Remove User From Blocklist
const addOrRemoveUser = async (userID, user) => {
    return await User.findOneAndUpdate(
        { user: userID },
        user,
        { new: true, runValidators: true }
    );
};

// Edit User Info
const editUserInfo = async (userID, userInfo) => {
    return User.findOneAndUpdate(
        { user: userID },
        userInfo,
        { new: true, runValidators: true }
    );
};

export default { getUserInfoByUser, addOrRemoveUser, editUserInfo };