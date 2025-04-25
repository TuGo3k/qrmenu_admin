"use client";
import Particles from "@/utils/reactbits/Particles";
import { useState } from "react";
import { Eye, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/Context/AuthProvider";
import axios from "axios";
import apiData from "@/data/apidata";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        apiData.api_url + `/user/login`,
        {
          email,
          password,
        }
      );

      if (!response.data.success) {
        alert(response.data.message || "Нэвтрэхэд алдаа гарлаа");
        return;
      }

      const user = response.data.user;
      const token = response.data.token;

      // Хэрэглэгчийн ID болон мэдээллийг хадгалах
      localStorage.setItem("userId", user._id);
      localStorage.setItem("suser", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Auth context-руу өгөгдөл дамжуулах
      login(response.data);

      // Амжилттай нэвтэрсэн тул нүүр хуудас руу
      router.push("/");
    } catch (error) {
      console.error("Login failed", error.response?.data || error);
      alert(error.response?.data?.message || "Нэвтрэх үед алдаа гарлаа");
    }
  };

  return (
    <div className="flex justify-center w-full gap-10 items-center min-h-screen px-0 max-md:p-0 py-10 bg-black relative">
      <div className="absolute h-screen w-full top-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="w-[40%] lg:w-md h-screen lg:h-full max-md:w-full space-y-6 px-12 lg:rounded-lg shadow-md text-white flex lg: flex-col justify-center z-10">
        <h2 className="text-center text-3xl font-bold my-12">Нэвтрэх</h2>
        <div className="flex flex-col">
          <div className="flex relative mb-6">
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-none w-full bg-white/40 text-white p-4 pr-10 border-[1px] border-black/50 rounded-md placeholder:text-accent-400"
              placeholder="Нэвтрэх нэр"
            />
            <User
              className="absolute text-white  right-3 top-1/2 transform -translate-y-1/2 "
              size={20}
            />
          </div>
          <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none w-full bg-white/40 text-white p-4 pr-10 border-[1px] border-black/50 rounded-md placeholder:text-accent-400"
              placeholder="Нууц үг"
              type={passwordVisible ? "text" : "password"}
            />
            <Eye
              onClick={togglePasswordVisibility}
              className="absolute cursor-pointer text-white right-3 top-1/2 transform -translate-y-1/2"
              size={20}
            />
          </div>
          <p className="text-sm text-right mt-3 cursor-pointer">
            Нууц үг мартсан
          </p>
        </div>
        <div className="flex justify-center lg:mt-0 mt-10">
          <button
            onClick={handleLogin}
            className="w-full inline-flex justify-center border-white border-2 text-white px-14 py-2 rounded-md cursor-pointer"
          >
            Нэвтрэх
          </button>
        </div>
        <div className="text-center flex justify-center items-center gap-4 text-sm">
          <div className="w-full bg-black h-[1px]"></div>
          Эсвэл
          <div className="w-full bg-black h-[1px]"></div>
        </div>
        <p className="text-center mb-10 text-sm">
          Та бүртгүүлээгүй бол{" "}
          <span className="underline cursor-pointer">
            <Link href="/auth/signup">энд дарна уу?</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
