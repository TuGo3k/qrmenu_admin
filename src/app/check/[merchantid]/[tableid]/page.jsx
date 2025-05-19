"use client";

import { useEffect, useState } from "react";
import getRequest from "@/utils/api/getRequest";
import { useParams } from "next/navigation";

const Page = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const {tableid , merchantid} = useParams();

  useEffect(() => {
    getRequest({
      route: `/user/${merchantid}`,
      setValue: setUser,
      setIsLoading: setLoading
    });
  }, [merchantid]);
  
  useEffect(() => {
    if (!loading && user?.own_web_id) {
      window.location.href = `${user.own_web_id}/table/${tableid}/${merchantid}`;
    }
  }, [loading, user, merchantid, tableid]);
  


  return (
    <div className="absolute z-50 h-screen w-screen flex justify-center items-center">
        <div className="flex w-full h-full justify-center items-center">
        <div className="loader"></div>
        </div>
    </div>
  );
};

export default Page;
