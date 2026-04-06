const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("audio")) {
      cb(null, "uploads");
    } else if (file.mimetype.startsWith("video")) {
     cb(null, "uploads/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post(
  "/upload",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  (req, res) => {
    res.json({ message: "Files uploaded successfully" });
  }
);

app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
