"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { throwableTrashItems } from "../../components/detectableItems";
import { useRouter } from "@/i18n/navigation";

export default function Detect() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    tf.ready().then(() => {
      console.log("TensorFlow.js is ready.");
    });
  }, []);

  const capture = async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        fetch(screenshot)
          .then((res) => res.blob())
          .then((blob) => setImageBlob(blob));

        // Process the image with ML
        await detectObjects(screenshot);
      }
    }
  };

  const detectObjects = async (imageSrc: string) => {
    setLoading(true);
    setMessage(null); // Reset message

    const img = new window.Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      const model = await cocoSsd.load();
      const predictions = await model.detect(img);

      const items = predictions.map((prediction) => prediction.class);
      setDetectedItems(items);
      setLoading(false);

      // Logic to check if conditions are met
      const hasTrashBin =
        items.includes("trash bin") ||
        items.includes("toilet") ||
        items.includes("bin") ||
        items.includes("trash can") ||
        items.includes("garbage bin") ||
        items.includes("garbage can") ||
        items.includes("waste bin") ||
        items.includes("waste container") ||
        items.includes("recycling bin") ||
        items.includes("rubbish bin") ||
        items.includes("litter bin") ||
        items.includes("dustbin") ||
        items.includes("waste basket") ||
        items.includes("trash container") ||
        items.includes("trash receptacle") ||
        items.includes("waste receptacle") ||
        items.includes("dumpster");
      const hasTrashItem = items.some((item) =>
        throwableTrashItems.includes(item)
      );

      if (hasTrashBin && hasTrashItem) {
        setMessage("✅ Success! You are such a nice person.");
        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        setMessage("❌ Keep trying! Make sure you're holding trash near a bin.");
      }
    };
  };

  const retakePhoto = () => {
    setImage(null);
    setImageBlob(null);
    setDetectedItems([]);
    setMessage(null);
  };

  return (
    <div className="flex flex-col items-center  max-h-[88vh]  rounded-3xl p-4">
      <div className="w-[90vw] md:w-[80vw] lg:w-[50vw] h-[80vh] flex flex-col items-center justify-center  relative overflow-hidden">
        {/* Camera simulation */}
        <div className="w-full h-[80vh] rounded-2xl overflow-hidden bg-black flex justify-center items-center">
          {image ? (
            // captured image section 
            <div className="w-full overflow-hidden relative h-full">
              <Image
                src={image}
                alt="Captured"
                objectFit="cover"
                fill
                className="rounded-2xl"
              />
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              className="w-full h-full rounded-2xl"
              videoConstraints={{
                facingMode: { exact: "environment" }, // Forces the back camera
              }}
            />
          )}
        </div>

        {/* Buttons and Detected Info */}
        <div className="mt-4 w-full text-center">
          {image ? (
            <>
              <button
                onClick={retakePhoto}
                className="px-6 py-2 bg-red-500 text-white rounded-full w-40 hover:bg-red-600 transition"
              >
                Retake Photo
              </button>

              {/* Show detected objects */}
              <div className="text-center mt-4">
                {loading ? (
                  <p className="text-gray-600">Processing image...</p>
                ) : (
                  <>
                    <p className="text-green-600">Detected: {detectedItems.join(", ")}</p>
                    {message && (
                      <p className="text-xl font-bold mt-2">{message}</p>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
          <div className="flex justify-center items-center">
            <button
              onClick={capture}
              className="bg-blue-500 text-white rounded-full w-16 h-16 flex justify-center items-center shadow-lg hover:bg-blue-600 transition"
            >
              <span className="text-3xl">📸</span>
            </button>
          </div>
          )}
        </div>

       
      </div>
    </div>
  );
}
