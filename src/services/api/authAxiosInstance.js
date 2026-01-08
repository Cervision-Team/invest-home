import axios from "axios";

const authAxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "base_url_here",
	timeout: 10000,
});


export default authAxiosInstance;
