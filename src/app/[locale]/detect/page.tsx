"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {throwableTrashItems} from "../../components/detectableItems"
import {useRouter} from '@/i18n/navigation';
 

 

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
          .then(res => res.blob())
          .then(blob => setImageBlob(blob));

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

      const items = predictions.map(prediction => prediction.class);
      setDetectedItems(items);
      setLoading(false);

      // Logic to check if conditions are met
      const hasTrashBin = items.includes("trash bin") || 
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
      const hasTrashItem = items.some(item => throwableTrashItems.includes(item));

      if ( hasTrashBin && hasTrashItem) {
        setMessage("✅ Success! You are such a nice man.");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-200 p-4">
      <div className="w-[90vw] md:w-[80vw] lg:w-[50vw] h-[90vh] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4">
        {image ? (
          <div className="w-full overflow-hidden relative h-[50vh]">
            <Image src={image} alt="Captured" objectFit="cover" fill className="rounded-lg" />
          </div>
        ) : (
            <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-full h-auto rounded-lg"
            videoConstraints={{
              facingMode: { exact: "environment" }, // Forces the back camera
            }}
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

              {/* Show detected objects */}
              <div className="text-center mt-4">
                {loading ? (
                  <p className="text-gray-600">Processing image...</p>
                ) : (
                  <>
                    <p className="text-green-600">Detected: {detectedItems.join(", ")}</p>
                    {message && <p className="text-xl font-bold mt-2">{message}</p>}
                  </>
                )}
              </div>

             
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
