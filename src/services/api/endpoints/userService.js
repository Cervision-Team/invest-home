import axios from "../axiosInstance";

export const getUser = async () => {
	try {
		const res = axios.get(`/api/user`);
		return res;
	} catch (err) {
		console.log(err);
	}
};
export const updateUser = async (user) => {
	try {
		const res = axios.put(`/api/user`, user);
		return res;
	} catch (err) {
		console.log(err);
	}
};
export const updateUserImage = async (image) => {
	try {
		let payload = image;

		if (typeof FormData !== "undefined" && !(image instanceof FormData)) {
			const formData = new FormData();
			formData.append("image", image);
			payload = formData;
		}

		const res = await axios.patch(`/api/user/change-image`, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const deleteUserImage = async () => {
	try {
		const res = await axios.delete(`/api/user/delete-image`);
		return res;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const getAgent = async () =>{
	try {
		const res = await axios.get(`/api/user/agent`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}


export const getEmployee = () =>{
	try {
		const res = axios.get(`/api/user/employees`);
		return res;
	} catch (err) {
		console.log(err);
	}
}

export const saveEmployee = async (employee) => {
	try {
		const res = await axios.post(`/api/user/save-employee`, employee);
		return res;
	} catch (err) {
		console.log(err);
		throw err;
	}
};
