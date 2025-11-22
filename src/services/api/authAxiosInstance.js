import axios from "axios";

const authAxiosInstance = axios.create({
	baseURL: "http://72.62.33.205:8080/api",
	timeout: 10000,
});

export default authAxiosInstance;
