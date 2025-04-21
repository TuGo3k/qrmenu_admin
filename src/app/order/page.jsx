import React from "react";
import MainContainer from "@/utils/MainContainer";
import ContentContainer from "@/utils/ContentContainer";
import OrderContainer from "@/components/Order/OrderTable";
import Navbar from "@/components/Home/Navbar";
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
   <div className="grid grid-cols-4 gap-5">
   <OrderContainer
          orderNumber={3}
          tableNumber={5}
          items={[
            {
              name: "Шарсан тахиа",
              quantity: 2,
              price: 12000,
              image: "/images/fried-chicken.jpg",
            },
            {
              name: "Каппучино",
              quantity: 1,
              price: 8000,
              image: "/images/cappuccino.jpg",
            },
            {
              name: "Цэвэр ус 500мл",
              quantity: 3,
              price: 1500,
              image: "/images/water.jpg",
            },
          ]}
        />
        <OrderContainer
          orderNumber={3}
          tableNumber={5}
          items={[
            {
              name: "Шарсан тахиа",
              quantity: 2,
              price: 12000,
              image: "/images/fried-chicken.jpg",
            },
            {
              name: "Каппучино",
              quantity: 1,
              price: 8000,
              image: "/images/cappuccino.jpg",
            },
            {
              name: "Цэвэр ус 500мл",
              quantity: 3,
              price: 1500,
              image: "/images/water.jpg",
            },
          ]}
        />
        <OrderContainer
          orderNumber={3}
          tableNumber={5}
          items={[
            {
              name: "Шарсан тахиа",
              quantity: 2,
              price: 12000,
              image: "/images/fried-chicken.jpg",
            },
            {
              name: "Каппучино",
              quantity: 1,
              price: 8000,
              image: "/images/cappuccino.jpg",
            },
            {
              name: "Цэвэр ус 500мл",
              quantity: 3,
              price: 1500,
              image: "/images/water.jpg",
            },
          ]}
        />
   </div>
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
