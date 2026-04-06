import React, { useState, useRef } from "react";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./App.css";

function App() {

  const [images, setImages] = useState({
    box1: null,
    box2: null,
    box3: null,
    box4: null
  });

  const [preview, setPreview] = useState(null);

  const [cropBox, setCropBox] = useState({
    active: null,
    crop: { unit: "%", width: 80, height: 80, x: 10, y: 10 }
  });

  const imgRef = useRef(null);

  const openFile = (id) => {
    document.getElementById(id).click();
  };

  const selectFile = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
    setCropBox({
      active: id,
      crop: { unit: "%", width: 80, height: 80, x: 10, y: 10 }
    });
  };

  const dropFile = (e, id) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
    setCropBox({
      active: id,
      crop: { unit: "%", width: 80, height: 80, x: 10, y: 10 }
    });
  };

  const allowDrop = (e) => e.preventDefault();

  const cropImage = () => {
    const crop = cropBox.crop;

    if (!imgRef.current || !crop.width || !crop.height) {
      alert("Please select crop area");
      return;
    }

    const image = imgRef.current;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = crop.x || 0;
    const cropY = crop.y || 0;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      cropX * scaleX,
      cropY * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");

    setImages((prev) => ({
      ...prev,
      [cropBox.active]: base64Image
    }));

    setPreview(null);
    setCropBox({ active: null, crop: {} });
  };

  const uploadImages = async () => {
    try {
      for (const box of ["box1", "box2", "box3", "box4"]) {
        if (!images[box]) continue;

        await axios.post("http://localhost:5000/upload", {
          box,
          imageData: images[box]
        });
      }

      alert("Uploaded successfully!");
    } catch (err) {
      console.log(err);
      alert("Upload error");
    }
  };

  const clearAll = () => {
    setImages({
      box1: null,
      box2: null,
      box3: null,
      box4: null
    });
  };

  return (
    <div className="app">

      <div className="header">
        <h2>Dashboard</h2>
        <p>Welcome User</p>
      </div>

      <div className="container">

        <div className="sidebar">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
          <h3>User</h3>
          <ul>
            <li>Dashboard</li>
            <li>My Images</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>

        <div className="main">

          <div className="boxes">
            {["box1", "box2", "box3", "box4"].map((id) => (
              <div  key={id}  className="box"  onClick={() => openFile(id)}  onDrop={(e) => dropFile(e, id)}  onDragOver={allowDrop}  >
                {images[id] ? (
                  <img src={images[id]} alt="" />
                ) : (
                  <p>Click or Drop Image</p>
                )}

                <input  id={id}  type="file"  hidden  onChange={(e) => selectFile(e, id)}  />
              </div>
            ))}
          </div>

          {preview && (
            <div className="crop-modal">
              <ReactCrop  crop={cropBox.crop}  onChange={(c) =>  setCropBox((prev) => ({ ...prev, crop: c }))  }  >
                <img src={preview}  alt=""  onLoad={(e) => (imgRef.current = e.currentTarget)}  />
              </ReactCrop>

              <button onClick={cropImage}>Crop & Save</button>
            </div>
          )}

          <div className="buttons">
            <button id="upload" onClick={uploadImages}>Upload</button>
            <button id="clear" onClick={clearAll}>Clear </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;