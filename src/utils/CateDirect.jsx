"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
export const CateDirect = () => {
    const pathname = usePathname()
    const title = pathname.split('/').filter(Boolean)[0]; // removes empty "" and gives "dashboard"

  return (
    <div
      className="w-full py-5 px-5 flex justify-between top-0 items-center 
        max-md:fixed max-md:w-screen"
    >
      <div className="flex items-center text-sm text-gray-600 space-x-2">
        <Link href="/" className="hover:underline hover:text-blue-600">
          Home
        </Link>
        <span><MdOutlineKeyboardArrowRight size={20}/></span>
        <Link href={`/${title}`} className="hover:underline text-blue-600 hover:text-blue-600">
          {title}
        </Link>
      </div>
    </div>
  );
};
