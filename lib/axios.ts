import axios, { AxiosInstance } from "axios";
import { getToken } from "./token";

export const BASE_URL = "http://192.168.1.91:5001/api";
// http://your_device_ip_ad:5001/api

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
