import React from 'react'
import LanguageChange from './LangChange'

import { Phudu } from "next/font/google";

const phudu = Phudu({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-phudu",
});


const Navbar =async () => {


  return (
    <div className='h-[12vh] text-3xl grid grid-cols-2 sm:grid-cols-3 items-center justify-center w-full  '>
      <LanguageChange/>
      <div className='flex items-center justify-center w-full '>
        <h1 className={`${phudu.className} font-semibold text-3xl sm:text-4xl`}>SNAP BIN</h1>
      </div>
        
      <div className='hidden sm:flex'/>
    </div>
  )
}

export default Navbar