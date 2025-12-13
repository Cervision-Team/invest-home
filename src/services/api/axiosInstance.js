import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://api.investhome.az/api",
	timeout: 10000,
});
// 72.62.33.205

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access-token");
		console.log("request log");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {

			localStorage.removeItem("access-token");
			
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
