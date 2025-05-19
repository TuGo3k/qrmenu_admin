// import axiosInstance from "@/utils/axiosInstance"; 

import axiosInstance from "./axios";

const deleteRequest = async ({ route, successFunction, errorFunction, setIsLoading }) => {
  return axiosInstance.delete(route) 
    .then(() => {
      successFunction && successFunction();
    })
    .catch((e) => {
      errorFunction && errorFunction(e);
    })
    .finally(() => {
      setIsLoading && setIsLoading(false);
    });
};

export default deleteRequest;
