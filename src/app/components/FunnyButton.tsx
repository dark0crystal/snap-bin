"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";


export default function FunnyButton() {

    const t = useTranslations("HomePage");
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className=" rounded-3xl px-4 py-2 cursor-pointer w-20 md:w-30 flex items-center justify-center mt-6"
    >
      <Link href="/detect">
        <motion.span
          className="text-xl sm:text-2xl md:text-4xl font-semibold text-[#f9f5ec] flex tracking-wider"
          initial={{ x: 0 }}
          animate={{ x: [0, -5, 5, -5, 5, 0] }} // Funny shake animation
          transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
        >
          {t("detect")}
        </motion.span>
      </Link>
    </motion.div>
  );
}
//comment