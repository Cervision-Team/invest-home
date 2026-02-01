import axios from "../axiosInstance";

export const createAnnouncement = async (formData) => {
	try {
		const res = await axios.post("/api/announcement", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const getAnnouncement = async () => {
	try {
		const res = await axios.get("/api/announcement?pageIndex=0&pageSize=5");
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
export const getAnnouncementFilter = async (filter = {}, { page = 0, size = 10 } = {}) => {
	try {
		const res = await axios.post(
			`/api/announcement/main?page=${page}&size=${size}`,
			filter
		);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
export const getAnnouncementById = async (id) => {
	try {
		const res = await axios.get(`/api/announcement/${id}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const getAnnouncementCity = async () => {
	try {
		const res = await axios.get("/api/announcement/city");
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const getAnnouncementDistrict = async (cityId) => {
	try {
		if (cityId == null || cityId === "") return [];
		const res = await axios.get(`/api/announcement/district/${cityId}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const getAnnouncementSettlement = async (districtId) => {
	try {
		if (districtId == null || districtId === "") return [];
		const res = await axios.get(`/api/announcement/settlement/${districtId}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
export const getAnnouncementByUser = async (status) => {
	try {
	const res = await axios.get(`/api/announcement/by-user?status=${status}&pageIndex=${0}&pageSize=${20}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
export const getAnnouncementByStatus = async (status) => {
	try {
	const res = await axios.get(`/api/announcement/by-status?status=${status}&pageIndex=${0}&pageSize=${100}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const getMyApprovedAnnouncements = async () => getAnnouncementByUser("APPROVED");
export const getMyPendingAnnouncements = async () => getAnnouncementByUser("PENDING");
export const getMyAssignedToAgentAnnouncements = async () => getAnnouncementByUser("ASSIGNED_TO_AGENT");
export const getMyRejectedAnnouncements = async () => getAnnouncementByUser("REJECTED");
export const getMyArchivedAnnouncements = async () => getAnnouncementByUser("ARCHIVED");
export const getMySoldAnnouncements = async () => getAnnouncementByUser("SOLD");

export const assignAgent = async (announcementId, agentId) => {
	try {
		const res = await axios.patch(
			`/api/announcement/${announcementId}/assign-agent`,{id:agentId}
		);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const approveAnnouncement = async (announcementId, status) => {
	try {
		const res = await axios.patch(
			`/api/announcement/${announcementId}/approve/${status}`
		);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

/*{
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
		}*/
