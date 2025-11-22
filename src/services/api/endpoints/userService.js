import axios from "../axiosInstance";

export const getUser = async () => {
	try {
		const res = axios.get(`/user`);
		return res;
	} catch (err) {
		console.log(err);
	}
};
