import axios from "axios";

const API_URL = "http://172.25.96.20:8081/api/auth/public";

export const loginWithPhone = async (phone) => {
  const response = await axios.post(
    `${API_URL}/login/phone`,
    {}, // empty body
    {
      params: { phone }, // send as query param
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const registerUser = async ({ fullName, phone }) => {
  const response = await axios.post(`${API_URL}/sign/up`, { fullName, phone });
  return response.data;
};

export const verifyOTP = async (otp) => {
  const phone = localStorage.getItem("phone");
  const entranceType = localStorage.getItem("entranceType");
  const response = await axios.post(`${API_URL}/verify/OTP`, {
    entranceType,
    phone,
    otp,
  });
  return response.data;
};

export const resendOTP = async () => {
  const phone = localStorage.getItem("phone");
  const entranceType = localStorage.getItem("entranceType");
  const response = await axios.post(`${API_URL}/resend/OTP`, {
    entranceType,
    phone,
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
