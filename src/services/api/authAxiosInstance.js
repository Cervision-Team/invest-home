import axios from "axios";

const authAxiosInstance = axios.create({
	baseURL: "https://api.investhome.az/api",
	timeout: 10000,
});

// 192.168.0.233

export default authAxiosInstance;
