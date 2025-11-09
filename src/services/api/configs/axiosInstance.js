import axios from "axios";
// import "./interceptors";

const axiosInstance = axios.create({
	baseURL: "http://192.168.0.190:8081/api",
	timeout: 10000,
});

axiosInstance.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			console.log("jjjjjj");

			const token = localStorage.getItem("access-token");
			console.log("uuuuu", token);

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error)
);

// Import interceptors

export default axiosInstance;
