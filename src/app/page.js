"use client";
import CustomInput from "@/utils/CustomInput";
import MainContainer from "@/utils/MainContainer";
import PrimaryButton from "@/utils/PrimaryButton";
import { useState } from "react";
import { CiCircleMinus } from "react-icons/ci";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Home/Navbar";
import ContentContainer from "@/utils/ContentContainer";
import Table from "@/utils/Table"
export default function Home() {
  const [name, setName] = useState("");
  return (
    <MainContainer>
      <Navbar />
      <ContentContainer>
      <Table/>



      </ContentContainer>
      {/* <div>

        <PrimaryButton icon={<CiCircleMinus color="white" size={20} />} text={'asdas'} color={'red'} />
      </div> */}
      {/* <button className="bg-white">asd</button> */}
      {/* <CustomInput value={name} onChange={setName} placeHolder={'Нэр'} /> */}
    </MainContainer>
  );
}
