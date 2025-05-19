import MainContainer from "@/utils/MainContainer";
import React from "react";
import Navbar from "@/components/Home/Navbar";
import ContentContainer from "@/utils/ContentContainer";
import TableCategory from "@/utils/TableCategory"
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <TableCategory />
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
