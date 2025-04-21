import MainContainer from "@/utils/MainContainer";
import React from "react";
import Navbar from "@/components/Home/Navbar";
import { CateDirect } from "@/utils/CateDirect";
import ContentContainer from "@/utils/ContentContainer";

import ProductTable from "@/utils/ProductTable"
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <CateDirect />
        <ProductTable />
        {/* <CustomTable/> */}
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
