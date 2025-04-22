// utils/deleteRequest.js
import apidata from "@/data/apidata";
import axios from "axios";

const deleteRequest = async ({ route, successFunction, errorFunction, setIsLoading }) => {
  return axios.delete(apidata.api_url + route)
    .then(() => {
      successFunction && successFunction();
    })
    .catch((e) => errorFunction && errorFunction(e))
    .finally(() => setIsLoading && setIsLoading(false));
};

export default deleteRequest;
