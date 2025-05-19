"use client";

import Navbar from "@/components/Home/Navbar";
import ProfilePage from "@/components/profile/Profile";
import getRequest from "@/utils/api/getRequest";
import putRequest from "@/utils/api/putRequest";
import ContentContainer from "@/utils/ContentContainer";
import MainContainer from "@/utils/MainContainer";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen , setIsOpen] = useState(false)

  useEffect(() => {
    getRequest({
      route: `/user`,
      setValue: setUser,
      setIsLoading,
    });
  }, []);

  const handleUpdate = (updatedData) => {
    putRequest({
      route: `/user/update-profile/${user._id}`,
      payload: updatedData,
      onSuccess: () => {
        alert("Амжилттай шинэчиллээ");
        setUser(updatedData); 
      },
    });
  };
  

  return (
    <MainContainer>
      <Navbar />
      <ContentContainer>
        {user && (
          <ProfilePage
            user={user}
            onUpdate={handleUpdate}
            isLoading={isLoading}
            setIsOpen={setIsOpen}
          />
        )}
      </ContentContainer>
    </MainContainer>
  );
};

export default Page;
