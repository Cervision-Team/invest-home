import axios from "../axiosInstance";

export const getRoles = async () => {
  try {
    const res = await axios.get("/api/roles");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createRole = async ({ name }) => {
  try {
    const res = await axios.post("/api/roles", { name });
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateRole = async ({ id, name }) => {
  try {
    const res = await axios.put("/api/roles", { id, name });
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteRole = async (roleId) => {
  try {
    const res = await axios.delete(`/api/roles/${roleId}`);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
