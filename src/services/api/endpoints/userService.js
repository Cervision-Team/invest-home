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
export const updateUserImage = async (image) => {
	try {
		let payload = image;

		// Allow passing a File/Blob directly; wrap it in FormData.
		if (typeof FormData !== "undefined" && !(image instanceof FormData)) {
			const formData = new FormData();
			// Backend commonly expects "image" or "file"; we use "image" to match the function name.
			formData.append("image", image);
			payload = formData;
		}

		const res = await axios.patch(`/user/change-image`, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
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