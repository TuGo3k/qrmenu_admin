"use client";
import apiData from "@/data/apidata";
import getRequest from "@/utils/api/getRequest";
import postRequest from "@/utils/api/postRequest";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [fetch, setFetch] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("amar_pos");
        if (loading) {
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                console.log('stored+' + storedUser);
                getRequest({
                    isUser: true,
                    route: `/api/merchantData?userId=${parsedUser.userId}`,
                    // setValue: setUser,
                    setIsLoading,
                    errorFunction: () => {
                        // alert('aldaa');
                        localStorage.removeItem("amar_pos");
                        setUser(null);
                    }
                }).then(() => {
                    setUser(parsedUser);
                });
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (fetch && user) {
            getRequest({
                route: `api/merchantData?userId=${user.userId}`,
                setValue: (updatedUser) => {
                    if (updatedUser) {
                        localStorage.setItem("amar_pos", JSON.stringify(updatedUser));
                        setUser(updatedUser);
                    }
                },
                setIsLoading,
                errorFunction: () => {
                    console.log("Fetch алдаа");
                }
            }).finally(() => setFetch(false));
        }
    }, [fetch]);

    const login = async (loginData) => {
        if (loginData?.accessToken && loginData?.userId) {
            try {
                const baseUser = {
                    accessToken: loginData.accessToken,
                    userId: loginData.userId,
                };

                const response = await axios.get(
                    `${apiData.api_url}/merchantData?userId=${loginData.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${loginData.accessToken}`,
                        },
                    }
                );

                const merchantInfo = response.data?.data?.[0];

                const fullUser = { ...baseUser, ...merchantInfo };

                setUser(fullUser);
                localStorage.setItem("amar_pos", JSON.stringify(fullUser));

                console.log("Нэвтрэлт амжилттай:", fullUser);
            } catch (err) {
                console.error("Merchant мэдээлэл авахад алдаа гарлаа:", err);
                alert("Нэвтрэх явцад алдаа гарлаа.");
            }
        } else {
            alert("Нэвтрэхэд алдаа гарлаа. Token байхгүй байна.");
        }
    };


    const register = (userData) => {
        postRequest({
            route: "api/login/createUser",
            body: userData,
            isNavigate: false,
            updateUser: () => {
                setUser(userData);
                localStorage.setItem("amar_pos", JSON.stringify(userData));
                console.log("Бүртгэл амжилттай.");
            },
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("amar_pos");
        router.push('/auth/login');
    };

    const updateUser = (updatedData) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedData };
            localStorage.setItem("amar_pos", JSON.stringify(newUser));
            return newUser;
        });
    };

    const fetchUpdateUser = () => {
        setFetch(true);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, fetchUpdateUser, loading, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}