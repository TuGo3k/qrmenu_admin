"use client";
import React from "react";

export default function Company() {
  return (
    <div className="max-w-7xl  px-4  ">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">Компанийн танилцуулга</h1>
      <section className="mb-5">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Бидний тухай</h2>
        <p className="text-gray-700 leading-relaxed">
          Манай компани нь 20xx онд үүсгэн байгуулагдсан бөгөөд технологи, үйлчилгээний салбарт тэргүүлэгч байхын төлөө ажиллаж байна. 
          Үйлчлүүлэгчдийнхээ хэрэгцээнд нийцсэн шийдлийг санал болгохыг эрхэмлэдэг.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Эрхэм зорилго</h2>
        <p className="text-gray-700 leading-relaxed">
          Бид хэрэглэгч бүрт үнэ цэнэ бүхий бүтээгдэхүүн, үйлчилгээг хүргэж, олон улсын стандартад нийцсэн чанарыг эрхэмлэнэ.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Үнэт зүйлс</h2>
        <ul className="list-disc list-inside text-gray-700 leading-loose">
          <li>Шударга байдал</li>
          <li>Харилцагч төвтэй байдал</li>
          <li>Иновац</li>
          <li>Багаар ажиллах чадвар</li>
        </ul>
      </section>

      <section className="mb-5">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Үйл ажиллагааны чиглэл</h2>
        <p className="text-gray-700 leading-relaxed">
          Бид дараах салбаруудад үйл ажиллагаа явуулдаг:
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-loose mt-2">
          <li>Мэдээлэл технологи</li>
          <li>Зөвлөх үйлчилгээ</li>
          <li>Худалдаа</li>
          <li>Сургалт</li>
        </ul>
      </section>

      <section className="mb-5">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Холбоо барих</h2>
        <p className="text-gray-700 leading-relaxed">
          Хаяг: Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Төв оффисын байр<br />
          Утас: +976 99112233<br />
          Имэйл: info@tanai-company.mn<br />
          Вэбсайт: www.tanai-company.mn
        </p>
      </section>
    </div>
  );
}
