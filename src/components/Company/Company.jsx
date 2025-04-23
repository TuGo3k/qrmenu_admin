"use client";
import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaGlobe } from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Company() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollTop) {
        setIsScrollingDown(true); // scrolling down
      } else {
        setIsScrollingDown(false); // scrolling up
      }
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT: CONTENT */}
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center md:text-left bg-white inline-block p-2 rounded-2xl shadow-lg">
            Компанийн танилцуулга
          </h1>

          <section className="mb-6 rounded-2xl shadow-lg bg-white p-3">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Бидний тухай</h2>
            <p className="text-gray-700 leading-relaxed">
              Манай компани нь 20xx онд байгуулагдсан бөгөөд технологи болон үйлчилгээний салбарт амжилттай ажиллаж байна. Бид харилцагчийн хэрэгцээг ойлгож, оновчтой шийдлүүдийг санал болгодог.
            </p>
          </section>

          <section className="mb-6 rounded-2xl shadow-lg bg-white p-3">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Эрхэм зорилго</h2>
            <p className="text-gray-700 leading-relaxed">
              Үйлчлүүлэгч бүрт үнэ цэнийг бий болгож, олон улсын стандартад нийцсэн, найдвартай бүтээгдэхүүн үйлчилгээг хүргэх.
            </p>
          </section>

          <section className="mb-6 rounded-2xl shadow-lg bg-white p-3">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Үнэт зүйлс</h2>
            <ul className="list-disc list-inside text-gray-700 leading-loose space-y-1">
              <li>Шударга, ил тод байдал</li>
              <li>Харилцагч төвтэй хандлага</li>
              <li>Иноваци ба тасралтгүй хөгжүүлэлт</li>
              <li>Багаар ажиллах чадвар</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl shadow-lg bg-white p-3">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Үйл ажиллагааны чиглэл</h2>
            <ul className="list-disc list-inside text-gray-700 leading-loose space-y-1">
              <li>Мэдээлэл технологи</li>
              <li>Бизнес зөвлөх үйлчилгээ</li>
              <li>Худалдаа</li>
              <li>Мэргэжлийн сургалт</li>
            </ul>
          </section>

          <section className="bg-gray-50 rounded-xl p-5 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Холбоо барих</h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Улаанбаатар, Сүхбаатар дүүрэг</p>
              <p className="flex items-center gap-2"><FaPhoneAlt className="text-blue-500" /> +976 99112233</p>
              <p className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> info@tanai-company.mn</p>
              <p className="flex items-center gap-2"><FaGlobe className="text-blue-500" /> www.tanai-company.mn</p>
            </div>
          </section>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="hidden md:flex flex-col h-full gap-5 relative">
      <div
        className={`sticky transition-all duration-300 ${
          isScrollingDown ? "bottom-0" : "top-0"
        }`}
      >
        <Image
          src="/images/company.jpg"
          alt="Company"
          width={600}
          height={300}
          className="rounded-2xl shadow-lg object-cover bg-white p-2"
        />
      </div>
    </div>
      </div>
    </div>
  );
}
