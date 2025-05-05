"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import apiData from "@/data/apidata";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${apiData.api_url}/user/login`, { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user_info", JSON.stringify(res.data.user));
        toast.success("Амжилттай нэвтэрлээ!");
        setTimeout(() => {
          router.push("/product");
        },2000)
      }
    } catch (error) {
      console.error("Нэвтрэхэд алдаа гарлаа:", error);
      alert("Нэвтрэх үед алдаа гарлаа.");
    }
  };

  const register = async (registerData) => {
    try {
      const res = await axios.post(`${apiData.api_url}/user/register`, registerData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user_info", JSON.stringify(res.data.user));
        toast.success("Амжилттай бүртгүүллээ!");
        // router.push("/auth/login");
      }
    } catch (error) {
      console.error("Бүртгэл хийхэд алдаа гарлаа:", error);
      alert("Бүртгэл хийхэд алдаа гарлаа.");
    }
  };

  const signup = async (registerData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const dataWithUser = {
        ...registerData,
        user: userInfo?._id,
        merchantId: userInfo?._id,
      };
  
      const res = await axios.post(`${apiData.api_url}/user/register`, dataWithUser);
      if (res.data.success) {
        toast.success("Хэрэглэгч амжилттай бүртгэгдлээ!");
      }
    } catch (error) {
      console.error("Бүртгэл хийхэд алдаа гарлаа:", error);
      alert("Бүртгэл хийхэд алдаа гарлаа.");
    }
  };
  
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_info");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading ,signup}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
