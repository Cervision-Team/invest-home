"use client";
import authAxiosInstance from "@/services/api/authAxiosInstance";

export const AUTH_ERROR_CODE_MESSAGES = {
	RESET_PASSWORD_TOKEN_INVALID_OR_EXPIRED: "Yeniden cehd edin",
};

export const getAuthErrorMessage = (backendMessage, fallbackMessage = "Xəta baş verdi") => {
	if (!backendMessage) return fallbackMessage;
	return AUTH_ERROR_CODE_MESSAGES[backendMessage] || backendMessage;
};

export const getAuthErrorMessageFromAxios = (err, fallbackMessage = "Xəta baş verdi") => {
	const backendMessage = err?.response?.data?.message;
	return getAuthErrorMessage(backendMessage, fallbackMessage);
};

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

export const requestPasswordReset = async ({ email }) => {
	const response = await authAxiosInstance.post(`/api/auth/forgot-password?email=${email}`);
	return response.data;
};

export const resetPassword = async ({ token, password }) => {
	const response = await authAxiosInstance.post("/api/auth/reset-password", {
		token,
		newPassword: password,
	});
	return response.data;
};
