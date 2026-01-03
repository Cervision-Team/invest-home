import axios from "../axiosInstance";

export const createAgent = async (formData) => {
	try {
		const res = await axios.post("/agent", formData);
		return res.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const getMyAgents = async ({ pageIndex, pageSize } = {}) => {
	try {
		const params = {};
		if (typeof pageIndex === "number") params.page = pageIndex;
		if (typeof pageSize === "number") params.size = pageSize;
		const res = await axios.get("/agent", { params });
		return res.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
};
