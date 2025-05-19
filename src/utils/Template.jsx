"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import apiData from "@/data/apidata";
import { useAuth } from "@/components/Context/AuthProvider";
import toast from "react-hot-toast";
import io from "socket.io-client";

let socket;

const Template = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useAuth();

  useEffect(() => {
    socket = io("http://localhost:8000");

    socket.on("new-state", () => {
      setIsLoading(true);
    });

    return () => {
      socket.off("new-state");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      axios
        .get(`${apiData.api_url}/template`)
        .then((res) => {
          setDatas(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching templates:", err);
          toast.error("Failed to fetch templates");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isLoading]);

  const handleToggle = async (link) => {
    try {
      const token = JSON.parse(localStorage.getItem("qmenu"))?.accessToken;
      await axios.put(
        `${apiData.api_url}/user/${user._id}`,
        {
          own_web_id: user?.own_web_id === link ? "" : link,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        own_web_id: prev?.own_web_id === link ? "" : link,
      }));

      toast.success("Updated successfully");
    } catch (err) {
      console.error("Error toggling link:", err);
      toast.error("An error occurred");
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {datas.map((e) => {
        const isActive = user?.own_web_id === e.link;

        return (
          <div
            key={e._id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
          >
            {e.covers?.[0] && (
              <img
                src={apiData.file_api_url + e.covers[0]}
                alt={e.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-800">{e.name}</p>
              <a
                href={e.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline block mb-2"
              >
                {e.link}
              </a>

              <button
                className={`px-3 py-1 text-sm rounded ${
                  isActive ? "bg-green-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => handleToggle(e.link)}
              >
                {isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Template;
