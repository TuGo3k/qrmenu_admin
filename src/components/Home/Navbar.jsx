"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from "@/components/Context/AuthProvider";
const Navbar = ({ title }) => {
  const [isInfo, setIsInfo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  useEffect(() => {
    if (isLoading && user?._id && !logout) {
      getRequest({
        route: `/table?user=${user.isMerchant ? user._id : user.merchantId}`,
        setValue: setTables,
        errorFunction: () => console.error("Failed to fetch data"),
      }).finally(() => setIsLoading(false));
    }
  }, [isLoading, logout]);

  return (
    <div
      className="w-full bg-[var(--maincolor)] px-5 flex justify-between top-0 items-center py-3
        max-md:fixed max-md:w-screen"
    >
      <div className="w-[20vw]  rounded-full flex items-center px-4 py-2 gap-2 bg-[var(--hover)]">
        <IoSearchOutline className="size-6 text-[var(--search-color)]" />
        <input
          type="text"
          placeholder="Хайх хэсэг"
          className="w-full rounded-lg  focus:outline-none  "
        />
      </div>
      <div className="flex justify-between max-md:w-full items-center md:gap-7">
        <h1 className="text-nowrap">
          Зочинтой ширээ:
          {tables.filter((table) => table.isActive === true).length}
        </h1>

        <div className="max-md:block hidden w-[40%]">
          <IoMenu size={30} onClick={() => setIsOpen(true)} />
          {/* {isOpen ? <MobileSidebar handleClose={() => setIsOpen(false)} /> : null} */}
        </div>
        <div className="max-md:w-[50%] w-full gap-5 flex justify-end items-center">
          <img
            onClick={() => location.reload(false)}
            className="w-7 h-7 cursor-pointer object-cover"
            src="/assets/navbar/refresh.svg"
            alt=""
          />
          <img
            className="w-7 h-7 object-cover"
            src="/assets/navbar/msg.svg"
            alt=""
          />
          <div className="flex max-md:hidden justify-center items-center gap-2">
            <img
              className="w-5 h-5 object-cover"
              src="/assets/navbar/wallet.svg"
              alt=""
            />
            <p>Үнэгүй</p>
          </div>
          <img
            className="w-7 h-7 object-cover"
            src="/assets/navbar/bell.svg"
            alt=""
          />
          <div
            onClick={() => setIsInfo(!isInfo)}
            className="cursor-pointer flex justify-center items-center gap-3 px-2 relative"
          >
            {user ? user.name : "Гост"}
            {!isInfo ? (
              <IoIosArrowDown size={25} onClick={() => setIsInfo(true)} />
            ) : (
              <IoIosCloseCircleOutline
                size={25}
                onClick={() => setIsInfo(false)}
              />
            )}
            {isInfo && (
              <div className="absolute duration-300 transition-all top-0 right-0 bg-white custom-shadow rounded-lg h-10 w-30 mt-12 p-2 z-30">
                <div onClick={logout} className="w-full ">
                  Гарах
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
