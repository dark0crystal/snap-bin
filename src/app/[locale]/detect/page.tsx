// To integrate TensorFlow.js for object detection in your Snap Bin app, we'll use the CocoSSD model (a lightweight, pre-trained model for detecting objects like bins, bottles, and trash).

'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function Detect() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        fetch(screenshot)
          .then(res => res.blob())  // Convert base64 to Blob
          .then(blob => setImageBlob(blob));
      }
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setImageBlob(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-200 p-4">
      <div className="w-[90vw] md:w-[80vw] lg:w-[50vw] h-[90vh] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4">
        {image ? (
          // Display captured image
          <div className="w-full overflow-hidden relative h-[80vh]">
            <Image src={image} alt="Captured" objectFit="cover" fill className="rounded-lg" />
          </div>
        ) : (
          // Show webcam feed
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-full h-auto rounded-lg"
          />
        )}

        <div className="mt-4 flex gap-4">
          {image ? (
            <>
              <button
                onClick={retakePhoto}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Retake Photo
              </button>

              {/* Allow user to download image */}
              {imageBlob && (
                <a
                  href={URL.createObjectURL(imageBlob)}
                  download="captured_image.png"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Download
                </a>
              )}
            </>
          ) : (
            <button
              onClick={capture}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Capture Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
