// Path
import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/profile pictures');
    },
    filename: (req, file, cb) => {
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Upload
export const ProfilePicUplaod = multer({
    storage: storage
});