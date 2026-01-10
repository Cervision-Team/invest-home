"use client";
import authAxiosInstance from "@/services/api/authAxiosInstance";
import axios from "axios";

const API_URL = "http://172.25.96.20:8081/api/auth/public";

export const loginWithEmail = async ({ email, password }) => {
	const response = await authAxiosInstance.post("/api/auth/login", {
		email,
		password,
	});
	return response.data;
};

export const registerUser = async ({ fullName, email, password }) => {
	const response = await authAxiosInstance.post("/api/auth/sign-up", {
		fullName,
		email,
		password,
	});
	return response.data;
};

export const verifyOTP = async (otp) => {
	const email = localStorage.getItem("email");
	const entranceType = localStorage.getItem("entranceType");
	const response = await authAxiosInstance.post(`/api/auth/verify/otp`, {
		entranceType,
		email,
		otp,
	});
	return response.data;
};

export const resendOTP = async () => {
	const email = localStorage.getItem("email");
	const entranceType = localStorage.getItem("entranceType");
	const response = await authAxiosInstance.post(`/api/auth/resend/otp`, {
		entranceType,
		email,
	});
	return response.data;
};

export const loginWithGoogle = async (googleToken) => {
	try {
		const response = await authAxiosInstance.post(
			`/api/auth/google`,{ idToken: googleToken }
		);
		return response.data;
	} catch (error) {
		console.error("Google login failed:", error.response || error);
		throw error;
	}
};
