import axios from "../axiosInstance";


export const getUser = async (id) => {
	try {
		const res = axios.get(`/user/${id}`);
		return res;
	} catch (err) {
		console.log(err);
	}
};
