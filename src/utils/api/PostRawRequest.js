import apiData from "@/data/apidata";
import axios from "axios";

const postRawRequest = async ({
  route,
  method = "POST",
  setValue,
  setIsLoading,
  errorFunction,
  updateUser,
  body,
}) => {
  const storedData = JSON.parse(localStorage.getItem("qmenu"));
  const token = storedData?.accessToken;

  try {
    const res = await axios({
      url: apiData.api_url + route,
      method: method,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (updateUser) updateUser();
    if (setValue) setValue(res.data.data?.[0] || res.data.data);

    return res; 

  } catch (err) {
    console.error("PostRawRequest алдаа:", err);
    if (errorFunction) errorFunction(err);
    return { status: 500, data: null }; 
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export default postRawRequest;
