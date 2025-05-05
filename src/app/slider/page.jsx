import MainContainer from "@/utils/MainContainer";
import React from "react";
import Navbar from "@/components/Home/Navbar";
import ContentContainer from "@/utils/ContentContainer";
import SliderTable from "@/utils/SliderTable";

const page = () => {

  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <SliderTable />
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
