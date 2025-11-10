import axios from "axios";

const authAxiosInstance = axios.create({
	baseURL: "http://192.168.0.200:8081/api",
	timeout: 10000,
});

export default authAxiosInstance;
