"use client";
import Navbar from "@/components/Home/Navbar";
import MainContainer from "@/utils/MainContainer";
import UserTable from "@/utils/UserTable";
import React from "react";
import ContentContainer from "@/utils/ContentContainer";

const page = () => {
  return (
    <MainContainer>
      <Navbar />
      <ContentContainer>
        <UserTable />
      </ContentContainer>
    </MainContainer>
  );
};

export default page;
