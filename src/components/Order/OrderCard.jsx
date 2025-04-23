"use client";
import React from "react";
import apiData from "@/data/apidata";
export default function OrderContainer({ orderNumber, tableNumber, items, totalprice }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log(items)
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto my-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🧾 Захиалга #{orderNumber} — ᠲᠡᠪᠡᠯ №{tableNumber}
      </h2>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b pb-3 gap-4"
          >
            <img
              src={`${apiData.file_api_url}${item.image}`}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-md font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Тоо хэмжээ: {item.quantity}
              </p>
            </div>
            <div className="text-right text-gray-700 font-semibold">
              ₮{item.price}
              {/* {item.price * item.quantity} */}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-lg font-bold text-gray-900">
          Нийт дүн: <span className="text-green-600">{totalprice}₮</span>
        </p>
      </div>
    </div>
  );
}
