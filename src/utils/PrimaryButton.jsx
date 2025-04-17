"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import clsx from "clsx";

const PrimaryButton = ({ onClick, text, icon, color, link, iconcolor, className }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    link ? router.push(link) : onClick();
    setTimeout(() => setLoading(false), 5000);
  };

  return (
    <button
      onClick={handleClick}
      style={{ borderColor: color, color: color }}
      className={clsx(
       `bg-white/0 border-2 rounded-full relative  flex min-w-1/6 cursor-pointer justify-center items-center transition-all duration-300 group ${className}`,
        `hover:bg-[${color}]`,
        loading ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      <span className="group-hover:text-white ">{text}</span>
      <div
        style={{ backgroundColor: color }}
        className="rounded-full flex items-center justify-center p-1 absolute right-0 transition-all duration-300 group-hover:bg-white text-white"
      >
        {icon}
      </div>
    </button>
  );
};

export default PrimaryButton;
