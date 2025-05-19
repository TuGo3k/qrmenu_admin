import axios from "axios";

let utga = false;

export const axiosUrl =
  utga === true
    ? "https://tech.gai2.shop/api/tech"
    : "https://qmenubackender.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: axiosUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return config;
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
