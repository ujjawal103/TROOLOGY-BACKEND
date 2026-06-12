// multer.config.js
const multer = require("multer");

const storage = multer.memoryStorage(); // keep file in memory
const upload = multer({ storage , limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    } });

module.exports = upload;
