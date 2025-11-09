import axios from "../configs/axiosInstance";

export const getAccessControl = async () => {
	try {
		const res = axios.get("/role-claim/matrix");
		return res;
	} catch (err) {
		console.log(err);
	}
};
export const upadteAccessControl = async (payload) => {
	try {
		const res = axios.put("/role-claim", payload);
		return res;
	} catch (err) {
		console.log(err);
	}
};
