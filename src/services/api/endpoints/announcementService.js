import axios from "../axiosInstance";

export const createAnnouncement = async (formData) => {
	try {
		const res = await axios.post("/announcement", formData, 
            {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
    );
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
