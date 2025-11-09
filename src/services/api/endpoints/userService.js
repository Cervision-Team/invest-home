import axiosInstance from "../configs/axiosInstance";


export const getUser = async (id) => {
	try {
		const res = await axiosInstance.get(`/user/${id}`);
		console.log("get user");
		
		return res;
	} catch (err) {
		console.log(err);
	}
};
