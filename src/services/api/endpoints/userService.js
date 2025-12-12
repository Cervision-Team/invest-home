import axios from "../axiosInstance";

export const getUser = async () => {
	try {
		const res = axios.get(`/user`);
		return res;
	} catch (err) {
		console.log(err);
	}
};
export const updateUser = async (user) => {
	try {
		const res = axios.put(`/user`, user);
		return res;
	} catch (err) {
		console.log(err);
	}
};

export const getAgent = async () =>{
	try {
		const res = await axios.get(`/user/agent`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}