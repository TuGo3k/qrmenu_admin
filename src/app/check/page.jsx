"use client";

import { useAuth } from "@/components/Context/AuthProvider";
import { useEffect, useState } from "react";
import getRequest from "@/utils/api/getRequest";

const Page = ({ params }) => {
  const { user } = useAuth();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequest({
      route: `/template?user`,
      setValue: setDatas,
      setLoading,
    });
  }, []);

  useEffect(() => {
    if (!loading && user && user.own_web_id && datas.length > 0) {
      const matchedSite = datas.find(
        (site) => site._id === user.own_web_id
      );

      if (matchedSite) {
        const redirectUrl = `${matchedSite.link}/table/${params.tableId}`;
        window.location.href = redirectUrl;
      } else {
        console.error("Matching template not found.");
      }
    }
  }, [loading, user, datas, params.tableId]);

  return (
    <div className="text-center mt-10">
      <p>Удирдлагын төв рүү чиглүүлж байна...</p>
    </div>
  );
};

export default Page;
