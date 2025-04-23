"use client";
import React, { useEffect, useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import apiData from "@/utils/api/api";

const CustomImageUpload = ({
  value,
  setValue,
  name,
  isIndex,
  onChangeLalar,
}) => {
  const [preview, setPreview] = useState(null);
  const [indexPreview, setIndexPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (setValue) {
        setValue(file);
      } else {
        console.log("Алдаа");
      }
    }
  };

  useEffect(() => {
    if (value) {
      if (typeof value === "string" && value !== "no-jpg") {
        const baseImageUrl = apiData.file_api_url;
        setPreview(baseImageUrl + value);
      } else if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [value]);

  const handleIndexImageChange = (event) => {
    const file = event.target.files[0];
    if (onChangeLalar) {
      onChangeLalar(event);
      if (file) {
        setIndexPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (setValue) setValue((prev) => ({ ...prev, [name]: null }));
  };

  const handleRemoveIndexImage = () => {
    setIndexPreview(null);
  };
  // console.log("preview", preview, "preview");
  return (
    <div className="w-full">
      <div className="flex items-center text-black">
        <button
          onClick={() =>
            isIndex
              ? document.getElementById("upload_cover_" + name).click()
              : document.getElementById("upload").click()
          }
          className="p-3 bg-gray-100 rounded-md cursor-pointer w-full flex flex-col justify-center items-center gap-5"
        >
          <IoCloudUpload size={70} color="var(--maincolor)" />
          <h2 className="text-lg font-medium">Зураг оруулах</h2>
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        name={name}
        onChange={handleImageChange}
        id="upload"
        className="hidden"
      />

      {isIndex && (
        <input
          type="file"
          accept="image/*"
          name={`${name}_cover`}
          onChange={handleIndexImageChange}
          id={`upload_cover_${name}`}
          className="hidden"
        />
      )}

      {(preview || indexPreview) && (
        <div className="mt-5 flex-row flex gap-4">
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 text-white bg-red-600 bg-opacity-65 hover:bg-opacity-100 rounded-full p-1 ease-in-out duration-300"
              >
                <IoIosCloseCircleOutline size={30} color="white" />
              </button>
            </div>
          )}

          {indexPreview && (
            <div className="relative">
              <img
                src={indexPreview}
                alt="Index Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
              <button
                onClick={handleRemoveIndexImage}
                className="absolute top-0 right-0 text-white bg-red-600 bg-opacity-65 hover:bg-opacity-100 rounded-full p-1 ease-in-out duration-300"
              >
                <IoIosCloseCircleOutline size={30} color="white" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomImageUpload;
