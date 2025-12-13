import axios from "axios";

const authAxiosInstance = axios.create({
	baseURL: "http://172.25.96.108:8080/api",
	timeout: 10000,
});

// 192.168.0.233

export default authAxiosInstance;
