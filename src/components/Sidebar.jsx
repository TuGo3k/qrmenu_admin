"use client";
import sidebardata from "@/data/sidebardata";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const Sidebar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div
      style={{ background: "var(--maincolor)" }}
      className={`h-screen fixed p-5 flex flex-col max-md:hidden justify-start  gap-5 items-center transition-all duration-300 w-[13vw]`}
    >
      {/* <div className='border-b-[1px] border-white w-full py-2 flex justify-between items-center'>
                <h1 className={`text-white transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>Amar Pos</h1>
                <IoIosMenu onClick={() => setIsOpen(!isOpen)} cursor='pointer' color='white' size={25} />
            </div> */}
      <div className="flex items-center justify-between w-full gap-2">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcO3j2tUuDNPplkoV8lD6LmHBU0qyJgvt1Sw&s"
          alt=""
        />
        {isOpen && (
          <div className="flex w-full flex-col gap-3 transition-opacity duration-300">
            <h2 className="font-semibold text-sm text-white font-sans">
              E-commerce дэлгүүр
            </h2>
            <p className="text-xs text-[#d3d3d3] font-sans font-thin">
              Хүнсний дэлгүүр
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-center w-full gap-3 pt-4">
        {sidebardata.map((e, index) => (
          <div key={index} className="w-full">
            <div className="w-full">
              {/* <button key={index} onClick={() => setSelectedMenu(e.title)} className={`cursor-pointer text-white flex justify-between p-2 rounded-lg
                     ease-in-out duration-300 w-full items-center gap-2 ${selectedMenu === e.title ? 'bg-black/40' : 'hover:bg-black/15'}`}>
                                    <div className='flex items-center gap-2'>
                                        <img src={e.icon} className='h-8 w-8 object-cover' alt="" />
                                        <p className={`font-extralight transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>{e.title}</p>
                                    </div>
                                    {e.items && <IoIosArrowDown className={isOpen ? 'block' : 'hidden'} size={20} />}
                                </button> */}

              {e.link ? (
                <Link
                  href={e.link}
                  onClick={() => setSelectedMenu("")}
                  className={`cursor-pointer flex text-[var(--foreground)] justify-between p-2 rounded-lg
                     ease-in-out duration-300 w-full items-center gap-2 ${
                       pathName.includes(e.link) &&
                       selectedMenu ===
                         ""
                         ? "bg-orange-500 text-orange-400"
                         : "hover:bg-[var(--hover)] hover:text-[var(--sidebar-text-hover)] "
                     }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={e.icon} className="h-8 w-8 object-cover" alt="" />
                    <p
                      className={`font-extralight transition-all duration-300 ${
                        isOpen ? "block" : "hidden"
                      }`}
                    >
                      {e.title}
                    </p>
                  </div>
                  {e.items && (
                    <IoIosArrowDown
                      className={isOpen ? "block" : "hidden"}
                      size={20}
                    />
                  )}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => setSelectedMenu(e.title)}
                  className={`cursor-pointer text-[var(--foreground)] flex justify-between p-2 rounded-lg
                     ease-in-out duration-300 w-full items-center gap-2 ${
                       selectedMenu === e.title
                         ? "bg-[var(--sidebar-text-active)] text-[var(--sidebar-text-active:white)]"
                         : "hover:bg-[var(--hover)] hover:text-[var(--sidebar-text-hover)] "
                     }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={e.icon} className="h-8 w-8 object-cover" alt="" />
                    <p
                      className={`font-extralight transition-all duration-300 ${
                        isOpen ? "block" : "hidden"
                      }`}
                    >
                      {e.title}
                    </p>
                  </div>
                  {e.items && (
                    <IoIosArrowDown
                      className={isOpen ? "block" : "hidden"}
                      size={20}
                    />
                  )}
                </button>
              )}
            </div>
            {/* {selectedMenu} */}
            {isOpen ? (
              e.title === selectedMenu ||
              (e.items &&
                e.items.filter((el) => el.link === pathName).length > 0) ? (
                <div className="flex flex-col gap-3 w-full transition-all duration-300 p-4 bg-white/20 rounded-lg mt-2 text-[#333]">
                  {e.items.map((el, index) => (
                    <Link
                      href={el.link}
                      className={`text-sm font-sans ${
                        pathName == el.link && "text-black font-semibold"
                      }`}
                      key={index}
                    >
                      {el.title}
                    </Link>
                  ))}
                </div>
              ) : null
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
