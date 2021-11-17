const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    url:  process.env.MONGODB_URL || "mongodb://localhost:27017/chat-app",
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        // console.log(file.originalname);
        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-DuongHuuThang-${file.originalname}`;
            return filename;
        }
        return {
            bucketName: "photos",
            filename: `${Date.now()}-DuongHuuThang-${file.originalname}`,
        };
    },
});

module.exports = multer({ storage });
