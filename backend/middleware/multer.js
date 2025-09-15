import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        // Use a unique filename to avoid collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage })

export default upload