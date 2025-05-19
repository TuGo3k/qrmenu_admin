"use client";

import getRequest from '@/utils/api/getRequest';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/api/axios';
import { useAuth } from '@/components/Context/AuthProvider';

const Page = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuth()

  useEffect(() => {
    if (isLoading , user?._id) {
      getRequest({
        route: `/table?user=${user.isMerchant ? user._id : user.merchantId}`,
        setValue: setProducts,
      });
    }
  }, [isLoading , user]);

  const handleClick = async (id) => {

    console.log("Clicked", id); 
    try {
      const res = await axiosInstance.put(`/table/${id}`);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((item) =>
            item._id === id ? res.data.data : { ...item, isActive: false }
          )
        );
      }
    } catch (error) {
      console.error("Toggle хийх үед алдаа гарлаа:", error.response ? error.response.data : error);
    }
  };
  

  return (
    <div className="pt-40 pl-40">
      {products.map((product) => (
        <div key={product._id} className="flex items-center gap-2">
          <h1>{product.name}</h1>
          <button
            onClick={() => handleClick(product._id)}
            className={`px-3 py-1 rounded ${
              product.isActive ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Page;
