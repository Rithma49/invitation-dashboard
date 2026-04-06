const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const upload = multer({
  storage: multer.memoryStorage()
});

const sizes = {
  box1: { w: 1080, h: 1080 },
  box2: { w: 1080, h: 1350 },
  box3: { w: 1920, h: 1080 },
  box4: { w: 1080, h: 1920 }
};

app.post("/upload", upload.any(), async (req, res) => {
  try {

    for (let file of req.files) {

      const boxName = file.fieldname; 
      const size = sizes[boxName];
      if (!size) continue; 

      await sharp(file.buffer)
        .resize(size.w, size.h)
        .toFile(path.join(uploadFolder, boxName + ".jpg"));
    }

    res.send("Upload success");

  } catch (error) {
    console.log(error);
    res.status(500).send("Upload error");
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});