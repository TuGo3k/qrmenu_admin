"use client";
import { useState } from "react";
import { Eye, Mail, Phone, User } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Context/AuthProvider";
import Particles from "@/utils/reactbits/Particles";

export default function Page() {
    const router = useRouter();
    const { register } = useAuth();
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
    });
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await register(form);
      router.push('/auth/login')
    };
    
    const slides = [
        {
            image: "/poster.png",
            title: "Poster Title",
            content:
                "poster content is simply dummy text of the printing and typesetting industry...",
        },
        {
            image: "/poster.png",
            title: "Poster Title",
            content:
                "poster content is simply dummy text of the printing and typesetting industry...",
        },
        {
            image: "/poster.png",
            title: "Poster Title",
            content:
                "poster content is simply dummy text of the printing and typesetting industry...",
        },
    ];

    return (
        <div className="flex justify-center w-full gap-10 items-center max-md:p-0 min-h-screen px-0 py-10 bg-black relative">
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

            <form
                onSubmit={handleSubmit}
                className="w-[40%] lg:w-md h-screen lg:h-full max-md:w-full space-y-6 px-12 lg:rounded-lg shadow-md  text-white flex flex-col justify-center z-10"
            >
                <h2 className="text-center text-3xl font-bold my-12">Бүртгүүлэх</h2>
                <div className="flex flex-col">
                    <div className="flex relative mb-4">
                        <input
                            onChange={handleChange}
                            value={form.name}
                            name="name"
                            className="focus:outline-none w-full bg-white/40 text-white p-4 pr-10 border border-black/50 rounded-md placeholder:text-accent-400"
                            placeholder="Нэвтрэх нэр"
                        />
                        <User className="absolute text-white right-3 top-1/2 transform -translate-y-1/2" size={20} />
                    </div>
                    <div className="flex relative mb-4">
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            className="focus:outline-none w-full bg-white/40 text-white p-4 pr-10 border border-black/50 rounded-md placeholder:text-accent-400"
                            placeholder="И-мэйл оруулах"
                        />
                        <Mail className="absolute text-white right-3 top-1/2 transform -translate-y-1/2" size={20} />
                    </div>
                    <div className="flex relative mb-4">
                        <input
                            type="text"
                            name="phone"
                            onChange={handleChange}
                            value={form.phone}
                            className="focus:outline-none w-full bg-white/40 text-white p-4 pr-10 border border-black/50 rounded-md placeholder:text-accent-400"
                            placeholder="Утасны дугаар"
                        />
                        <Phone className="absolute text-white right-3 top-1/2 transform -translate-y-1/2" size={20} />
                    </div>
                    <div className="flex relative">
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="focus:outline-none w-full bg-white/40 text-white p-4 pr-10 border border-black/50 rounded-md placeholder:text-accent-400"
                            placeholder="Нууц үг"
                        />
                        <Eye className="absolute text-white right-3 top-1/2 transform -translate-y-1/2" size={20} />
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    <button type="submit" className="border-white border-2 text-white px-14 py-2 rounded-md cursor-pointer">
                        Бүртгүүлэх
                    </button>
                </div>
                <div className="text-center flex justify-center items-center gap-4 text-sm">
                    <div className="w-full bg-white h-[1px]"></div>
                    Эсвэл
                    <div className="w-full bg-white h-[1px]"></div>
                </div>
                <p className="text-center mb-10 text-sm">
                    Та бүртгэлтэй бол{" "}
                    <span onClick={() => router.push('/auth/login')} className="underline cursor-pointer">
                        энд дарна уу?
                    </span>
                </p>
            </form>
        </div>
    );
}