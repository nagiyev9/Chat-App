// Path
import mongoose from "mongoose";

// Schema
const UserSchema = mongoose.Schema({
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        required: false,
        default: ""
    },
    location: {
        type: String,
        required: false,
        default: ""
    },
    last_seen_date: {
        type: Date,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        required: true,
    },
    block_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        default: []
    }]
}, {
    timestamps: true
});

// Model
export const User = mongoose.model('Users', UserSchema);