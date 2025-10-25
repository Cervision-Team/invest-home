export const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || "Server error occurred",
    };
  } else if (error.request) {
    return { message: "No response from server" };
  } else {
    return { message: error.message };
  }
};