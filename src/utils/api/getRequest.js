import apidata from "@/data/apidata";
import axios from "axios";

const getRequest = async ({ route, setValue, setIsLoading, errorFunction }) => {
  return axios.get(apidata.api_url + route)
    .then((e) => {
      setValue(e.data.data);
    })
    .catch((e) => errorFunction && errorFunction())
    .finally(() => setIsLoading && setIsLoading(false))
};

export default getRequest;