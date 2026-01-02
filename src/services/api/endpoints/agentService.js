import axios from "../axiosInstance";

export const createAgent = async (formData) => {
	try {
		const res = await axios.post("/agent", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
