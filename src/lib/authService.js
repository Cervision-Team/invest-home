"use client";
import authAxiosInstance from "@/services/api/authAxiosInstance";
import axios from "axios";

const API_URL = "http://172.25.96.20:8081/api/auth/public";

export const loginWithPhone = async ({ phoneNumber, password }) => {
	const response = await authAxiosInstance.post(
		"/auth/login",
		{
			phoneNumber,
			password,
		},
	);
	return response.data;
};

export const registerUser = async ({ fullName, phoneNumber, password }) => {
	const response = await authAxiosInstance.post("/auth/sign-up", {
		fullName,
		phoneNumber,
		password,
	});
	return response.data;
};

export const verifyOTP = async (otp) => {
	console.log("asfahsf");

	const phoneNumber = localStorage.getItem("phoneNumber");
	const entranceType = localStorage.getItem("entranceType");
	const response = await authAxiosInstance.post(`/auth/verify/otp`, {
		entranceType,
		phoneNumber,
		otp,
	});
	return response.data;
};

export const resendOTP = async () => {
	const phoneNumber = localStorage.getItem("phoneNumber");
	const entranceType = localStorage.getItem("entranceType");
	const response = await authAxiosInstance.post(`/auth/resend/otp`, {
		entranceType,
		phoneNumber,
	});
	return response.data;
};

export const loginWithGoogle = async (googleToken) => {
	try {
		const response = await axios.post(
			`${API_URL}/login/with/google`,
			{ token: googleToken }, // key must match backend
			{ headers: { "Content-Type": "application/json" } }
		);
		return response.data;
	} catch (error) {
		console.error("Google login failed:", error.response || error);
		throw error;
	}
};
