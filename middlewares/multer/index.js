var path = require("path");
var multer = require("multer");
var moment = require("moment");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${moment().format("dddd_MM_YYYY_HH:MM:SS")}_${file.originalname}`);
  },
});

var Multer = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

module.exports = Multer;
