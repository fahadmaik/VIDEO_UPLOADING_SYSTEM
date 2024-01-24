const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(
      " path.extname(file.originalname)",
      path.extname(file.originalname)
    );
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/videos")) {
      fs.mkdirSync("public/videos");
    }

    cb(null, "public/videos");
  },
  filename: function (req, file, cb) {
    filename =
      Date.now() + file.originalname.toLowerCase().split(" ").join(".");
    cb(null, filename);
  },
});

const fileFilter = function (req, file, cb) {
  var ext = path.extname(file.originalname);

  if (ext !== ".mkv" && ext !== ".mp4") {
    return cb("Only videos are allowed!", false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
