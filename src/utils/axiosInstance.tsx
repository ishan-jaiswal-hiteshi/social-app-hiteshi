import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.208:5000", // Set the base URL
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
