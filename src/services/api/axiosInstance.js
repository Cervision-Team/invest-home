import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://192.168.0.234:8081",
	timeout: 10000,
});

export default axiosInstance;
