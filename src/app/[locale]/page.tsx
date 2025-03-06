"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="h-fit flex flex-col items-center px-4">
      <div className="h-[50vh] md:h-[70vh] bg-[#003092] rounded-4xl w-full flex flex-col items-center relative p-4">
        {/* SNAP & EARN Section */}
        <div className="flex flex-row justify-center items-center w-full h-[20vh] flex-wrap text-center mt-16">
          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold  text-[#f8fe23]">{t("snap")}</div>
          
          <div className="bg-[#f8fe23] w-10 h-10 sm:w-18 sm:h-18 md:w-18 md:h-18 lg:w-[90px] lg:h-[90px] rounded-full text-6xl sm:text-8xl md:text-8xl lg:text-9xl font-bold flex justify-center items-center mx-3">
            <p>&</p>
          </div>

          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-[#f8fe23]">{t("earn")}</div>
        </div>

        {/* Title */}
        <h1 className="bg-white text-lg sm:text-xl md:text-2xl font-bold m-2 p-2 rounded-lg">
          {t("title")}
        </h1>

        {/* Detect Button */}
        <div className="bg-amber-200 rounded-3xl px-4 py-2 w-fit">
          <Link className="text-lg sm:text-2xl md:text-4xl font-semibold" href="/detect">
            {t("detect")}
          </Link>
        </div>
      </div>
    </div>
  );
}


// #f8fe23 green

// #7546ff purple

// #131313 black

// #f9f5ec near to white
