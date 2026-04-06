import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // image state
  const [images, setImages] = useState({
    box1: null,
    box2: null,
    box3: null,
    box4: null
  });

  // input refs
  const inputRefs = useRef({});
  const userName = "User";

  // open file picker
  const openFile = (id) => {
    inputRefs.current[id].click();
  };

  // file select
  const selectFile = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages({...images,  [id]: { file, url }  });
  };

  // drag drop
  const dropFile = (e, id) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages({  ...images,  [id]: { file, url }  });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // clear all
  const clearAll = () => {
    setImages({
      box1: null,
      box2: null,
      box3: null,
      box4: null
    });
  };

  // upload
  const uploadImages = async () => {
    const formData = new FormData();

    if (images.box1) formData.append("box1", images.box1.file);
    if (images.box2) formData.append("box2", images.box2.file);
    if (images.box3) formData.append("box3", images.box3.file);
    if (images.box4) formData.append("box4", images.box4.file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("Uploaded!");
    } catch (err) {
      alert("Error uploading");
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <h2>Dashboard</h2>
        <p>Welcome, {userName}</p>
      </div>

      <div className="container">
        {/* SIDEBAR */}
        <div className="sidebar">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
          <h3>{userName}</h3>
          <ul>
            <li>Dashboard</li>
            <li>My Images</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>

        {/* MAIN */}
        <div className="main">
          {/* BOXES */}
          <div className="boxes">
            {["box1", "box2", "box3", "box4"].map((id) => (
              <div key={id} className="box" onClick={() => openFile(id)} onDrop={(e) => dropFile(e, id)} onDragOver={allowDrop}>
                {images[id] ? (
                  <img src={images[id].url} alt="" />
                ) : (
                  <p>Drop Image</p>
                )}
                <input type="file"   ref={(el) => (inputRefs.current[id] = el)}   onChange={(e) => selectFile(e, id)}   hidden />
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="buttons">
            <button id="upload" onClick={uploadImages}>Upload</button>
            <button id="clear" onClick={clearAll}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;