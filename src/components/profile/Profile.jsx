"use client";
import React, { useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import axiosInstance from "@/utils/api/axios";

const ProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    phone_2: user?.phone_2 || "",
    address: user?.address || "",
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    phone_2: false,
    address: false,
  });

  const toggleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfileField = async (field) => {
    const fieldMap = {
      phone_2: "phone_2",
    };
  
    const apiField = fieldMap[field] || field;
  
    try {
      const response = await axiosInstance.put(`/user/${user.id}`, {
        [apiField]: form[field],
      });
  
      setForm((prev) => ({ ...prev, [field]: form[field] }));
  
      toggleEdit(field);
    } catch (error) {
      console.error("Хадгалах алдаа:", error.response?.data || error.message);
    }
  };
  
  const handleSave = (field) => {
    updateProfileField(field);
  };
  

  const renderField = (label, fieldName) => (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-sm text-gray-500 flex justify-between items-center">
        {label}
        {!editMode[fieldName] && (
          <button
            onClick={() => toggleEdit(fieldName)}
            className="text-blue-600 text-sm"
          >
            Засах
          </button>
        )}
      </h3>

      {editMode[fieldName] ? (
        <div className="mt-2 flex gap-2">
            <input
            type={fieldName === "email" ? "email" : "text"}
            name={fieldName}
            value={form[fieldName]}
            onChange={handleChange}
            className="w-full p-2 rounded shadow-custom-inner bg-white dark:text-white border border-gray-300 focus:outline-none focus:border-none"
            />

          <button
            onClick={() => handleSave(fieldName)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            gang
          </button>
        </div>
      ) : (
        <p className="text-base font-medium text-gray-800 dark:text-white">
          {form[fieldName] || "—"}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <div className="flex items-center space-x-6">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {form.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{form.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Эрх:{" "}
            <span className="capitalize">
              {user?.role === "merchant" ? "Захирал" : "user"}
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Бүртгүүлсэн: {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {renderField("Нэр", "name")}
        {renderField("И-мэйл", "email")}
        {renderField("Утасны дугаар", "phone")}
        {renderField("Нэмэлт утас", "phone_2")}
        {renderField("Гэрийн хаяг", "address")}
      </div>
    </div>
  );
};

export default ProfilePage;
