import MainContainer from "@/utils/MainContainer";
import React from "react";
import Navbar from "@/components/Home/Navbar";
import { CateDirect } from "@/utils/CateDirect";
import ContentContainer from "@/utils/ContentContainer";
import Table from "@/utils/Table"
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <CateDirect />
        <Table />
        {/* <CustomTable/> */}
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
