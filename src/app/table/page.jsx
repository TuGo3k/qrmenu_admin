import React from "react";
import MainContainer from "@/utils/MainContainer";
import ContentContainer from "@/utils/ContentContainer";
import TableTable from "@/utils/TableTable"
import Navbar from "@/components/Home/Navbar";
const page = () => {
  return (
    <MainContainer>
      <Navbar title={"Хянах самбар"} />
      <ContentContainer>
        <TableTable/>
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
