const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "..", "Uploads");

// Create Upload folder if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ✅ Delete all existing .apk files before saving new one
        const files = fs.readdirSync(uploadPath);
        for (const filename of files) {
            const filePath = path.join(uploadPath, filename);
            if (path.extname(filename).toLowerCase() === ".apk") {
                try {
                    fs.unlinkSync(filePath);
                    console.log("Deleted:", filename);
                } catch (err) {
                    console.error("Error deleting:", filename, err);
                }
            }
        }

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        // ✅ Always save with the fixed name: application.apk
        cb(null, "application.apk");
    },
});

const upload = multer({ storage });

module.exports = upload;
