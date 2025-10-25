import axios from "./axiosInstance";

axios.interceptors.request.use(
	(config) => {
		const token = null;
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
