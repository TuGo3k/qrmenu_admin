import MainContainer from "@/utils/MainContainer";
import React from "react";
import Navbar from "@/components/Home/Navbar";
import { CateDirect } from "@/utils/CateDirect";
import ContentContainer from "@/utils/ContentContainer";

import SubCategoryTable from "@/utils/SubCategoryTable"
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <CateDirect />
        <SubCategoryTable />
        {/* <CustomTable/> */}
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
