"use client"
import CustomInput from "@/utils/CustomInput";
import MainContainer from "@/utils/MainContainer";
import PrimaryButton from "@/utils/PrimaryButton";
import { useState } from "react";
import { CiCircleMinus } from "react-icons/ci";
import Sidebar from "@/components/Sidebar";
export default function Home() {
  const [name, setName] = useState('');
  return (
    <MainContainer>
      

      {/* <div>

        <PrimaryButton icon={<CiCircleMinus color="white" size={20} />} text={'asdas'} color={'red'} />
      </div> */}
      {/* <button className="bg-white">asd</button> */}
      {/* <CustomInput value={name} onChange={setName} placeHolder={'Нэр'} /> */}



    </MainContainer>
  );
}
