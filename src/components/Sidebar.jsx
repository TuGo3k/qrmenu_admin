"use client";
import sidebardata from "@/data/sidebardata";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "./Context/AuthProvider";
import { io } from "socket.io-client";

const Sidebar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("");
  const { user } = useAuth();
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("new-order", () => {
      setNewOrderCount((prev) => prev + 1); 
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pathName.includes("/order")) {
      setNewOrderCount(0);
    }
  }, [pathName]);

  return (
    <div
      style={{ background: "var(--maincolor)" }}
      className="h-screen fixed p-5 flex flex-col max-md:hidden justify-start gap-5 items-center transition-all duration-300 w-[13vw]"
    >
      <div className="flex items-center justify-between w-full gap-2">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcO3j2tUuDNPplkoV8lD6LmHBU0qyJgvt1Sw&s"
          alt="User avatar"
        />
        <div className="flex w-full flex-col gap-3">
          <h2 className="font-semibold text-sm text-black font-sans">
            {user ? user.name : "Guest"}
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center w-full gap-3 pt-4">
        {sidebardata
          .filter((item) => !item.role || user?.role === item.role)
          .map((e, index) => (
            <div key={index} className="w-full">
            {e.link ? (
                <Link
                  href={e.link}
                  onClick={() => setSelectedMenu("")}
                  className={`cursor-pointer flex justify-between p-2 rounded-lg w-full items-center gap-2 transition duration-300 
                    ${
                      pathName.includes(e.link) && selectedMenu === ""
                        ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text-active)]"
                        : "hover:bg-[var(--hover)] hover:text-[var(--sidebar-text-hover)]"
                    }`}
                >
                <div className="relative flex items-center gap-2">
                  {e.icon}
                  <p className={`font-extralight ${isOpen ? "block" : "hidden"}`}>
                    {e.title}
                  </p>

                  {e.showBadge && newOrderCount > 0 && (
                    <>
                      <span className="absolute -top-2 left-2 w-5 h-5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                      <span className="absolute -top-2 left-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center z-10">
                        {newOrderCount}
                      </span>
                    </>
                  )}
                </div>

                </Link>
              ) : (
                <button
                  onClick={() =>
                    setSelectedMenu((prev) => (prev === e.title ? "" : e.title))
                  }
                  className={`cursor-pointer flex justify-between p-2 rounded-lg w-full items-center gap-2 transition duration-300 
                    ${
                      selectedMenu === e.title
                        ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text-active)]"
                        : "hover:bg-[var(--hover)] hover:text-[var(--sidebar-text-hover)]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={e.icon} className="h-8 w-8 object-cover" alt={e.title} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>{e.title}</p>
                  </div>
                  {e.items && isOpen && <IoIosArrowDown size={20} />}
                </button>
              )}

              {isOpen &&
                (selectedMenu === e.title ||
                  e.items?.some((el) => el.link === pathName)) && (
                  <div className="flex flex-col gap-3 w-full transition-all duration-300 p-4 bg-white/20 rounded-lg mt-2 text-[#333]">
                    {e.items?.map((el, index) => (
                      <Link
                        href={el.link}
                        key={index}
                        className={`text-sm font-sans ${
                          pathName === el.link ? "text-black font-semibold" : ""
                        }`}
                      >
                        {el.title}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
