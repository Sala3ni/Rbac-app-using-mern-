import API from "./api";

// Get all users
export const getUsers = async () => {
  try {
    const res = await API.get("/users");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Assign role to user
export const assignRole = async (userId, roleId) => {
  try {
    const res = await API.post(`/users/${userId}/roles`, { roleId });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to assign role');
  }
};

// Get roles of user
export const getUserRoles = async (userId) => {
  try {
    const res = await API.get(`/users/${userId}/roles`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user roles');
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const res = await API.post("/users", userData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create user');
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const res = await API.put(`/users/${userId}`, userData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update user');
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const res = await API.delete(`/users/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete user');
  }
};
