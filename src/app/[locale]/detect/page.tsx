"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import styles from "./bar.module.css"
import { throwableTrashItems } from "../../components/detectableItems";

export default function Detect() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const t = useTranslations("detect")
  const router = useRouter();

  const capture = async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        fetch(screenshot)
          .then((res) => res.blob())
          .then((blob) => setImageBlob(blob));

        await detectObjects(screenshot);
      }
    }
  };

  const detectObjects = async (imageSrc: string) => {
    setLoading(true);
    setMessage(null);

    try {
      // Convert base64 to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('image', blob);

      // Call local YOLO model
      const result = await fetch('/api/detect', {
        method: 'POST',
        body: formData
      });

      const data = await result.json();
      
      // Extract detected classes from predictions
      const items: string[] = data.data.map((pred: {class: string}) => pred.class);
      setDetectedItems(items);

      // Check for trash bin and trash items
      const hasTrashBin = items.some((item: string) => [
        'trash bin', 'bin', 'garbage bin', 'waste bin',
        'recycling bin', 'rubbish bin', 'dumpster'
      ].includes(item.toLowerCase()));

      const hasTrashItem = items.some((item: string) =>
        throwableTrashItems.includes(item)
      );

      if (hasTrashBin && hasTrashItem) {
        setMessage(t("success"));
        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        setMessage(t("fail"));
      }

      setResult(data);

    } catch (error) {
      console.error('Error detecting objects:', error);
      setMessage('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setImageBlob(null);
    setDetectedItems([]);
    setMessage(null);
  };

  return (
    <div className="flex flex-col items-center  max-h-[90vh]  rounded-3xl p-4 ">
      <div className="w-[90vw] md:w-[80vw] lg:w-[50vw] h-[80vh] flex flex-col items-center justify-center  relative overflow-hidden">
        {/* Camera simulation */}
        <div className="w-full h-[75vh] rounded-2xl overflow-hidden bg-black flex justify-center items-center">
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
       
            {loading? (
            <div className={`${styles.animatescan} absolute top-0 left-0 w-full h-[4px] bg-green-500 `}></div>
            ):(<></>)}
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

        {result && (
          <div className={styles.result}>
            <h2>Results:</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
