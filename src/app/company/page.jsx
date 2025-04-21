import React from "react";
import MainContainer from "@/utils/MainContainer";
import ContentContainer from "@/utils/ContentContainer";
import Company from "@/components/Company/Company";
import Navbar from "@/components/Home/Navbar";
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <Company />
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
