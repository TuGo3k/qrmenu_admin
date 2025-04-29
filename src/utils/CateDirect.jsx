"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Category } from "@mui/icons-material";
export const CateDirect = () => {
  const pathname = usePathname()
  const title = pathname.split('/').filter(Boolean)[0]; 
  let translatedTitle = "Тодорхойгүй";
  switch (title) {
    case "category":
      translatedTitle = "Ангилал";
      break;
    case "subcategory":
      translatedTitle = "Дэд ангилал";
      break;
    case "product":
      translatedTitle = "Бүтээгдэхүүн";
      break;
    case "order":
      translatedTitle = "Захиалга";
      break;
  }

  return (
    <div
      className="w-full py-5 px-5 flex justify-between top-0 items-center 
        max-md:fixed max-md:w-screen"
    >
      <div className="flex items-center text-sm text-gray-600 space-x-2">
        <Link href="/" className="hover:underline hover:text-blue-600">
          Нүүр
        </Link>
        <span><MdOutlineKeyboardArrowRight size={20} /></span>
        <Link href={`/${title}`} className="hover:underline text-blue-600 hover:text-blue-600">
          {translatedTitle}
        </Link>
      </div>
    </div>
  );
};
