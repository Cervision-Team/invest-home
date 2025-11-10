import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://192.168.0.200:8081/api",
	timeout: 10000,
});


axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access-token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error)
);


export default axiosInstance;
