import axios from "../axiosInstance";

export const createAnnouncement = async (formData) => {
	try {
		const res = await axios.post("/announcement", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const getAnnouncement = async () => {
	try {
		const res = await axios.get("/announcement");
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
export const getAnnouncementById = async (id) => {
	try {
		const res = await axios.get(`/announcement/${id}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
