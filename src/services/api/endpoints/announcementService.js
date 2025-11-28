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
		const res = await axios.get("/announcement?pageIndex=0&pageSize=5");
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
export const getAnnouncementFilter = async () => {
	try {
		const res = await axios.post("/announcement/filter?page=0&size=10", {
			name: null,
			address: null,
			priceFrom: null,
			priceTo: null,
			numberOfRooms: null,
			floor: null,
			areaFrom: 50.0,
			areaTo: null,
			metro: [],
			district: [],
			propertyType: [],
			condition: [],
			documentStatus: [],
			characteristics: [],
			saleType: [],
			priority: [],
			approvalStatus: ["APPROVED"],
			isActive: true,
			createdAtFrom: null,
			createdAtTo: null,
			userId: null,
			agentId: null,
			neighborhoodId: null,
		});
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
