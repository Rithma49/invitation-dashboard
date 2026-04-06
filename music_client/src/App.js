import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [files, setFiles] = useState({
    audio: null,
    video: null
  });

  const audioRef = useRef();
  const videoRef = useRef();

  const userName = "User";

  // select file
  const handleFile = (file, type) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, [type]: { file, url } }));
  };

  // input change
  const handleInput = (e, type) => {
    handleFile(e.target.files[0], type);
  };

  // drag drop
  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file, type);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const uploadFiles = async () => {
    const formData = new FormData();

    if (files.audio) formData.append("audio", files.audio.file);
    if (files.video) formData.append("video", files.video.file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("Uploaded!");
    } catch (err) {
      alert("Upload error");
    }
  };

  const clearAll = () => {
    setFiles({
      audio: null,
      video: null
    });
  };

  return (
    <div className="app">

      <div className="header">
        <h2>Dashboard</h2>
        <p>Welcome, {userName}</p>
      </div>

      <div className="container">

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

        <div className="main">

          <div className="upload-section">

            {/* AUDIO */}
            <div  className="box"  onClick={() => audioRef.current.click()}   onDrop={(e) => handleDrop(e, "audio")}   onDragOver={allowDrop}
>
              {files.audio ? (
                <audio controls src={files.audio.url}></audio>
              ) : (
                <p>Click or Drag Audio</p>
              )}

              <input  type="file"  accept="audio/*"  ref={audioRef}  hidden  onChange={(e) => handleInput(e, "audio")}  />
            </div>

            {/* VIDEO */}
            <div  className="box"  onClick={() => videoRef.current.click()}  onDrop={(e) => handleDrop(e, "video")}  onDragOver={allowDrop}>
              {files.video ? (
                <video controls src={files.video.url}></video>
              ) : (
                <p>Click or Drag Video</p>
              )}

              <input  type="file"  accept="video/*"  ref={videoRef}  hidden  onChange={(e) => handleInput(e, "video")}  />
            </div>

          </div>

          <div className="buttons">
            <button id="upload" onClick={uploadFiles}>Upload</button>
            <button id="clear" onClick={clearAll}>Clear</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;