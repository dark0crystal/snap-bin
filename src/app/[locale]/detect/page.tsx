"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import styles from "./bar.module.css"
import test from "../../../../public/test.jpeg"

// Define your custom classes
const CLASSES = [
  'Bottle', 'Box', 'CAN', 'Can', 'Dustbin', 'LDPE', 'Tempat-sampah', 
  'Trash-Can', 'bin', 'bottle', 'bottled-drinks', 'can', 'canned-drinks', 
  'fake bag', 'glass', 'green bag', 'litter-bins', 'people', 'pet', 
  'plastic-bottles', 'plastic_cup', 'plasticbottle', 'tetrapack', 'trash', 
  'trashcan', 'wastebin', 'white bag'
];

// Define your categories
const GARBAGE_ITEMS = [
  'Bottle', 'Box', 'CAN', 'Can', 'LDPE', 'bottle', 'bottled-drinks', 
  'can', 'canned-drinks', 'fake bag', 'glass', 'green bag', 'pet', 
  'plastic-bottles', 'plastic_cup', 'plasticbottle', 'tetrapack', 'trash', 'white bag'
];

const TRASH_CONTAINERS = [
  'Dustbin', 'Tempat-sampah', 'Trash-Can', 'bin', 'litter-bins', 
  'trashcan', 'wastebin'
];

// Define your message categories
const MESSAGES: Record<string, string[]> = {
  both: [
    "Great job recycling! You're helping keep our environment clean.",
    "Thank you for disposing of waste properly! Every small action counts.",
    "You've made the environment cleaner by recycling correctly!",
    "Perfect! You're ensuring waste goes to the right place.",
    "You're a recycling champion! The planet thanks you.",
    "By recycling, you've just reduced pollution and saved resources!"
  ],
  onlyGarbage: [
    "Please find a recycling bin for this waste item.",
    "This item should go in a recycling container. Can you find one?",
    "Help keep our planet clean by placing this in a proper bin.",
    "This recyclable item needs a proper container. Find one nearby!",
    "Don't forget to dispose of this waste properly in a bin.",
    "This item needs a proper home in a recycling container."
  ],
  onlyContainer: [
    "Great recycling bin! Now find items to recycle in it.",
    "You've found a recycling point! Now collect your recyclables.",
    "This container is ready for your recyclable items.",
    "Recycling bin located! Now find some items to recycle.",
    "This container helps keep our environment clean. Find items to recycle!",
    "Ready to recycle? Now find items to put in this container."
  ],
  neither: [
    "No recyclables or bins detected. Try looking for waste items or containers.",
    "Keep searching for recycling opportunities around you.",
    "Let's find something to recycle or a container to use.",
    "Try again! Look for recyclable items or containers in your surroundings.",
    "No recycling detected yet. Keep exploring to find opportunities.",
    "Nothing to recycle here. Keep looking for waste items or bins."
  ]
};

export default function Detect() {
  const webcamRef = useRef<Webcam | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userIP, setUserIP] = useState("");
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  const t = useTranslations("detect");
  const router = useRouter();

  // Get a random message from a category
  function getRandomMessage(category: keyof typeof MESSAGES) {
    const messages = MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Load the model when component mounts
  useEffect(() => {
    async function loadModel() {
      await tf.ready();
      console.log("TensorFlow.js is ready.");
      
      // Load your custom YOLOv12 model
      try {
        const loadedModel = await tf.loadGraphModel('/web_model/model.json');
        setModel(loadedModel);
        console.log("YOLOv12 model loaded successfully");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }
    
    loadModel();
    
    // Fetch user IP
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setUserIP(data.ip))
      .catch(error => console.error('Error fetching IP:', error));
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

  const preprocessImage = async (imageSrc: string): Promise<tf.Tensor> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = imageSrc;
      img.crossOrigin = "anonymous";
  
      img.onload = () => { 
        // Create a tensor from the image and resize to 640x640 for YOLOv12
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([640, 640])
          .expandDims(0)
          .toFloat()
          .div(255.0); // Normalize to 0-1
        
        resolve(tensor);
      };
    });
  };
  

  const detectObjects = async (imageSrc: string) => {
    setLoading(true);
    setMessage(null); // Reset message
  
    if (!model) {
      console.error("Model not loaded");
      setLoading(false);
      setMessage("Error: Model not loaded");
      return;
    }
  
    try {
      // Preprocess the image
      const tensor = await preprocessImage(imageSrc);
      
      // Run inference
      const predictions = await model.executeAsync(tensor) as tf.Tensor[];

      // Ensure correct array access
      const bboxes = predictions[0] as tf.Tensor;
      const scores = predictions[1] as tf.Tensor;
      const classes = predictions[2] as tf.Tensor;
      
      // Convert tensors to arrays
// Convert tensors to JavaScript arrays
const boxesArr = await predictions[0].array();
const scoresArr = await predictions[1].array();
const classesArr = await predictions[2].array();

// Ensure scoresArr and classesArr are arrays of numbers (for example)
let flatScores: number[] = [];
let flatClasses: number[] = [];

if (Array.isArray(scoresArr)) {
  flatScores = scoresArr.flat(Infinity) as number[];
}

if (Array.isArray(classesArr)) {
  flatClasses = classesArr.flat(Infinity) as number[];
}

const threshold = 0.5;
const items: string[] = [];

if (!flatScores || !flatClasses || flatScores.length !== flatClasses.length) {
  console.error("Unexpected model output format.");
  return;
}

for (let i = 0; i < flatScores.length; i++) {
  if (flatScores[i] > threshold) {
    const classIndex = flatClasses[i];
    if (classIndex >= 0 && classIndex < CLASSES.length) {
      const className = CLASSES[classIndex];
      items.push(className);
    } else {
      console.error(`Invalid class index: ${classIndex} at position ${i}.`);
    }
  }
}


  
      tensor.dispose();
      predictions.forEach(t => t.dispose());
  
      setDetectedItems(items);
  
      // Check for categories
      const hasGarbageItem = items.some(item => GARBAGE_ITEMS.includes(item));
      const hasTrashContainer = items.some(item => TRASH_CONTAINERS.includes(item));
  
      let messageCategory: keyof typeof MESSAGES;
      if (hasGarbageItem && hasTrashContainer) {
        messageCategory = 'both';
      } else if (hasGarbageItem) {
        messageCategory = 'onlyGarbage';
      } else if (hasTrashContainer) {
        messageCategory = 'onlyContainer';
      } else {
        messageCategory = 'neither';
      }
  
      setMessage(getRandomMessage(messageCategory));
  
      if (messageCategory === 'both') {
        const reward = {
          date: new Date().toISOString(),
          ip: userIP,
          items: items.filter(item => GARBAGE_ITEMS.includes(item))
        };
  
        const existingRewards = JSON.parse(localStorage.getItem('trashRewards') || '[]');
        existingRewards.push(reward);
        localStorage.setItem('trashRewards', JSON.stringify(existingRewards));
  
        setTimeout(() => {
          router.push("/rewards");
        }, 3000);
      }
    } catch (error) {
      console.error("Error during detection:", error);
      setMessage("Error processing image.");
    }
  
    setLoading(false);
  };
  

  const retakePhoto = () => {
    setImage(null);
    setImageBlob(null);
    setDetectedItems([]);
    setMessage(null);
  };

  return (
    <div className="flex flex-col items-center max-h-[90vh] rounded-3xl p-4 ">
      <div className="w-[90vw] md:w-[80vw] lg:w-[50vw] h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Camera simulation */}
        <div className="w-full h-[75vh] rounded-2xl overflow-hidden bg-black flex justify-center items-center">
          {image ? (
            // Captured image section 
            <div className="w-full overflow-hidden relative h-full">
              <Image
                src={test}
                alt="Captured"
                objectFit="cover"
                fill
                className="rounded-2xl"
              />
         
              {loading ? (
                <div className={`${styles.animatescan} absolute top-0 left-0 w-full h-[4px] bg-green-500`}></div>
              ) : null}
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              className="w-full h-full rounded-2xl"
              videoConstraints={{
                facingMode: { exact: "environment" },
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
