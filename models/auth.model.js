// Path
import mongoose from "mongoose";

// Schema
const AuthSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        required: false,
    },
    resetTokenExpiration: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true
});

// Model
export const Auth = mongoose.model('auth', AuthSchema);