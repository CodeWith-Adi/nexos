'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });

            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
        } catch (err) {
            alert("Camera access denied or not available");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/png');
        setPhoto(imageData);
    };

    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center">

            {/*Camera Feed*/}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
            />

            {/*Controls*/}
            <div className="absolute bottom-6 flex gap-4">
                <button
                    onClick={takePhoto}
                    className="bg-white text-black px-6 py-3 rounded-full font-semibold"
                >
                    Capture
                </button>
            </div>

            {/*Hidden Canvas*/}
            <canvas ref={canvasRef} className="hidden" />

            {/*Preview*/}
            {photo && (
                <img
                    src={photo}
                    alt="captured"
                    className="absolute top-4 left-4 w-32 rounded-xl border"
                />
            )}
        </div>
    );
}