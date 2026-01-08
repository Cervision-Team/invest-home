import axios from "../axiosInstance";

export const getAccessControl = async () => {
	try {
		const res = axios.get("/api/role-claim/matrix");
		return res;
	} catch (err) {
		console.log(err);
	}
};
export const upadteAccessControl = async (payload) => {
	try {
		const res = axios.put("/api/role-claim", payload);
		return res;
	} catch (err) {
		console.log(err);
	}
};
