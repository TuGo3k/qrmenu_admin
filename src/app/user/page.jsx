"use client"
import Navbar from "@/components/Home/Navbar";
import MainContainer from "@/utils/MainContainer";
import UserTable from "@/utils/UserTable";
import React from "react"

const page = () => {

    return(
        <MainContainer>
            <Navbar />
            <UserTable />
        </MainContainer>
    )
}

export default page;