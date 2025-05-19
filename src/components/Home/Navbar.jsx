"use client";

import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosCloseCircleOutline } from "react-icons/io";
import { IoMenu, IoSearchOutline } from "react-icons/io5";
import { useAuth } from "@/components/Context/AuthProvider";
import getRequest from "@/utils/api/getRequest";
import { useRouter } from "next/navigation";
import { LogOut, UserPen } from "lucide-react";
import toast from "react-hot-toast";
import socket from "@/utils/socket/socket";

const Navbar = ({ title }) => {
  const [isInfo, setIsInfo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading && user?._id) {
      getRequest({
        route: `/table?user=${user.isMerchant ? user._id : user.merchantId}`,
        setValue: (data) => {
          setTables(data);
          setIsLoading(false);
        },
      });
    }
  }, [isLoading, user]);

  useEffect(() => {
    const handleNewTable = (newTable) => {
      setTables((prevTables) => {
        const existingIndex = prevTables.findIndex((t) => t._id === newTable._id);

        if (existingIndex !== -1) {
          const updated = [...prevTables];
          updated[existingIndex] = newTable;

          if (newTable.isActive) {
            toast.success("Зочин нэмэгдлээ", {
              id: `newTable-${newTable._id}`,
            });
          }

          return updated;
        } else {
          if (newTable.isActive) {
            toast.success("Шинэ зочин ширээнд суув", {
              id: `newTable-${newTable._id}`,
            });
          }

          return [newTable, ...prevTables];
        }
      });
    };

    socket.on("new-table", handleNewTable);
    return () => socket.off("new-table", handleNewTable);
  }, []);

  return (
    <div className="w-full bg-[var(--maincolor)] px-5 flex justify-between top-0 items-center py-3 max-md:fixed max-md:w-screen">
      <div className="w-[20vw] rounded-full flex items-center px-4 py-2 gap-2 bg-[var(--hover)]">
        <IoSearchOutline className="size-6 text-[var(--search-color)]" />
        <input
          type="text"
          placeholder="Хайх хэсэг"
          className="w-full rounded-lg focus:outline-none"
        />
      </div>

      <div className="flex justify-between max-md:w-full items-center md:gap-7">
        <h1 className="text-nowrap">
          Зочинтой ширээ:{" "}
          {tables.filter((table) => table.isActive === true || table.isActive === "true").length}
        </h1>

        <div className="max-md:block hidden w-[40%]">
          <IoMenu size={30} onClick={() => setIsOpen(true)} />
        </div>

        <div className="max-md:w-[50%] w-full gap-5 flex justify-end items-center">
          <div
            onClick={() => setIsInfo(!isInfo)}
            className="cursor-pointer flex justify-center items-center gap-3 px-2 relative"
          >
            {user ? user.name : "Гост"}
            {!isInfo ? (
              <IoIosArrowDown size={25} />
            ) : (
              <IoIosCloseCircleOutline size={25} />
            )}

            {isInfo && (
              <div className="absolute top-0 right-0 mt-12 z-30 w-32 h-auto bg-white rounded-lg shadow-lg p-2 transition-all duration-300">
                <div
                  onClick={() => router.push("/profile")}
                  className="w-full px-2 py-1 text-sm hover:bg-gray-100 text-blue-700 cursor-pointer rounded flex items-center gap-4"
                >
                  <UserPen size={16} color="blue" />
                  Профайл
                </div>
                <div
                  onClick={logout}
                  className="w-full px-2 py-1 text-sm hover:bg-gray-100 text-pink-400 cursor-pointer rounded flex items-center gap-4"
                >
                  <LogOut size={16} color="pink" />
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
