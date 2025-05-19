import axios from "axios";

const putRequest = async ({ route, payload, onSuccess, onError }) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API}${route}`, payload);
    if (res.data.success) {
      onSuccess?.(res.data.data);
    } else {
      alert(res.data.message || "Алдаа гарлаа");
    }
  } catch (err) {
    console.error("PUT алдаа:", err);
    onError?.(err);
  }
};

export default putRequest;
