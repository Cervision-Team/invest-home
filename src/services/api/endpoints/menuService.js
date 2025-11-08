import axios from "../axiosInstance";


export const getAccessControl = async () => {
	try {
		const res = axios.get("/v1/menu");
		return res;
	} catch (err) {
		console.log(err);
	}
};