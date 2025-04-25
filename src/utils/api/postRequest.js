import apidata from "@/data/apidata";
import axios from "axios";

const postRequest = async ({ route, body, isNavigate, updateUser, errorFunction }) => {
    try {
      const response = await axios.post(`${apidata.url + route}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!isNavigate) {
        updateUser && updateUser(response.data);
        if (typeof window !== "undefined") {
          location.reload(false);
        }
      }
    } catch (error) {
      console.error("Алдаа гарлаа:", error);
      if (errorFunction) {
        errorFunction(error);
      } else {
        alert("Алдаа гарлаа, дахин оролдоно уу.");
      }
    }
  };
  

export default postRequest;