'use client';
import React, { useRef, useEffect, useState } from 'react';

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error(err);
      alert("Camera access denied or not available");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Caprute Photo
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setPhoto(imageData);
    setShowSave(true);
  };

  // save to db
  const saveImage = async () => {
    const name =
      fileName && fileName.trim() !== ""
        ? fileName
        : "img-" + Date.now();

    const res = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "create_file",
        name: name.endsWith(".png") ? name : name + ".png",
        content: photo,
        folder: "images",
        type: "image"
      })
    });

    const data = await res.json();

    if (data.success) {
      setShowSave(false);
      setFileName("");
      setPhoto(null);
    } else {
      alert("Save failed");
    }
  };

  return (
    // Interface
    <div className="w-full h-full bg-black relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />
      <div className="absolute top-3 left-3 text-white text-sm bg-black/40 px-2 py-1 rounded">
        NexOS Camera
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={takePhoto}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Capture
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      {photo && (
        <div className="absolute top-4 right-4">
          <img
            src={photo}
            alt="captured"
            className="w-40 rounded-xl border border-white/20 shadow-lg"
          />
        </div>
      )}
      {showSave && (
        <div className="absolute bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-700 p-3 flex items-center gap-3">

          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter image name"
            className="bg-zinc-800 px-3 py-2 rounded-lg outline-none text-sm flex-1 text-white"
          />

          <span className="text-zinc-400 text-sm">
            .png
          </span>

          <button
            onClick={saveImage}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Save
          </button>

          <button
            onClick={() => {
              setShowSave(false);
              setPhoto(null);
            }}
            className="bg-red-600 px-3 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Cancel
          </button>

        </div>
      )}
    </div>
  );
}