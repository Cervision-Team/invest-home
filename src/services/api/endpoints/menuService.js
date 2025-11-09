import axios from "../axiosInstance";


export const getMenu = async () => {
	try {
		const res = await axios.get("/menu");
		return res.data;
	} catch (err) {
		console.log(err);
	}
};