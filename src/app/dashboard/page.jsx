import MainContainer from "@/utils/MainContainer";
import React from "react";
import Navbar from "@/components/Home/Navbar";
import { CateDirect } from "@/utils/CateDirect";
import ContentContainer from "@/utils/ContentContainer";
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <CateDirect />
        
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
