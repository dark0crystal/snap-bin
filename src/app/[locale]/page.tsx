"use client"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import trash images
import bag from "../../../public/trash/bag.png";
// import bottle from "../../../public/trash/bottle.png";
// import paper from "../../../public/trash/paper.png";
// import banana from "../../../public/trash/banana.png";
// import trashBin from "../../../public/trash/trash-bin.png";

export default function HomePage() {
  const t = useTranslations('HomePage');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"]
  });

  // Random positions for initial trash placement
  const trashItems = [
    { src: bag, alt: 'Plastic bag', initialX: '15%', initialY: '10%', size: 120 },
    { src: bag, alt: 'Plastic bottle', initialX: '70%', initialY: '25%', size: 170 },
    { src: bag, alt: 'Paper waste', initialX: '25%', initialY: '40%', size: 140 },
    { src: bag, alt: 'Banana peel', initialX: '60%', initialY: '15%', size: 165 },
  ];

  return (
    <div ref={containerRef} className="h-[150vh] w-full overflow-hidden relative">
      {/* Hero Section */}
      <div className="px-4 py-16 text-center">
        <motion.h1 
          className="text-4xl font-bold mb-4 inline-block bg-white px-6 py-3 rounded-lg shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('title')}
        </motion.h1>
        
        <motion.p
          className="text-xl max-w-2xl mx-auto mb-8 bg-white p-4 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {t('description') || "Small actions lead to big changes. Let's keep our planet clean!"}
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/about" className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors">
            {t('about')}
          </Link>
        </motion.div>
      </div>
      
      {/* Floating trash items */}
      {trashItems.map((item, index) => (
        <motion.div 
          key={index}
          className="absolute"
          style={{
            left: item.initialX,
            top: item.initialY,
          }}
          initial={{ rotate: 0 }}
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + index,
            ease: "easeInOut"
          }}
        >
          <motion.div
            style={{
              y: useTransform(
                scrollYProgress, 
                [0, 0.7, 1], 
                [0, window.innerHeight * 0.4, window.innerHeight * 0.65]
              ),
              x: useTransform(
                scrollYProgress,
                [0, 0.7, 1],
                [0, (index % 2 === 0 ? -50 : 50), 0]
              ),
              rotate: useTransform(
                scrollYProgress,
                [0, 1],
                [0, 360]
              ),
              scale: useTransform(
                scrollYProgress,
                [0, 0.9, 1],
                [1, 1, 0]
              ),
            }}
          >
            <Image 
              src={item.src} 
              width={item.size} 
              height={item.size} 
              alt={item.alt}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Trash bin at the bottom */}
      <motion.div 
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          scale: useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            [0.8, 1, 1.2]
          ),
        }}
      >
        <Image 
          src={bag} 
          width={200} 
          height={200} 
          alt="Trash bin"
          className="object-contain"
        />
        
        {/* Success message when scrolled to bottom */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0, 0.9, 1],
              [0, 0, 1]
            ),
          }}
        >
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
            {t('success') || "Thank you for keeping our planet clean!"}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Progress indicator */}
      <motion.div 
        className="fixed bottom-4 right-4 bg-white rounded-full p-2 shadow-md"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
        }}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
          style={{
            background: useTransform(
              scrollYProgress,
              [0, 1],
              ["rgb(220, 252, 231)", "rgb(74, 222, 128)"]
            )
          }}
        >
          <motion.div 
            className="text-green-800 font-bold"
            style={{
              scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]),
            }}
          >
            {Math.round(useTransform(scrollYProgress, [0, 1], [0, 100]).get())}%
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}