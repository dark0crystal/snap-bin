"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phudu } from "next/font/google";
import FunnyButton from "../components/FunnyButton";

const phudu = Phudu({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-phudu",
});

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="h-fit flex flex-col items-center px-4">
      <div className="h-[50vh] md:h-[70vh] bg-[#003092] rounded-4xl w-full flex flex-col items-center relative p-4 overflow-hidden">

        {/* Top Right SVG Line */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 100"
          className="w-48 h-30 rotate-45 absolute top-0  -right-16 sm:w-72 sm:h-32 sm:rotate-45 md:w-96 md:h-40 md:top-4 md:-right-24"
        >
          <defs>
            <linearGradient id="waveGradientTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#2658bb", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f8fe23", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0 50 C 150 0, 350 100, 500 50"
            stroke="url(#waveGradientTop)"
            strokeWidth="50"
            fill="transparent"
          />
        </svg>

        {/* SNAP & EARN Section */}
        <div className="flex flex-row justify-center items-center w-full h-[20vh] flex-wrap text-center md:mt-16">
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-[#f8fe23]">
            {t("snap")}
          </div>

          <div
            className={`${phudu.className} bg-[#f8fe23] w-10 h-10 sm:w-18 sm:h-18 md:w-18 md:h-18 lg:w-[90px] lg:h-[90px] rounded-full text-6xl sm:text-8xl md:text-8xl lg:text-9xl font-bold flex justify-center items-center mx-3`}
          >
            <p>&</p>
          </div>

          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-[#f8fe23]">
            {t("earn")}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-lg sm:text-xl md:text-xl font-bold m-2 p-2 rounded-lg md:mt-10 text-center">
          {t("title")}
        </h1>

        {/* Detect Button */}
        {/* <div className="bg-amber-200 rounded-3xl px-4 py-2 w-fit">
          <Link className="text-lg sm:text-2xl md:text-4xl font-semibold text-[#f9f5ec] " href="/detect">
            {t("detect")}
          </Link>
        </div> */}
        <FunnyButton/>

         {/* Bottom Left SVG Line */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 100"
        className="w-48 h-30 rotate-45 absolute bottom-0 -left-12 sm:w-72 sm:h-32 sm:rotate-45 md:w-96 md:h-40 md:bottom-4 md:-left-28"
      >
        <defs>
          <linearGradient id="waveGradientBottom" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#2658bb", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#f8fe23", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M0 50 C 150 0, 350 100, 500 50"
          stroke="url(#waveGradientBottom)"
          strokeWidth="50"
          fill="transparent"
        />
      </svg>
      </div>

     
    </div>
  );
}

// #f8fe23 green

// #7546ff purple

// #131313 black

// #f9f5ec near to white
