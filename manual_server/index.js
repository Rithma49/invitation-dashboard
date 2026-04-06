const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));  

const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

app.post("/upload", async (req, res) => {
  try {
    const { box, imageData } = req.body;
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    await sharp(buffer).toFile(path.join(uploadFolder, `${box}.jpg`));
    res.send("Cropped image uploaded!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Upload error");
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));


