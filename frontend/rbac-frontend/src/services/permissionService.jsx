import API from "./api";

// Get all permissions
export const getPermissions = async () => {
  try {
    const res = await API.get("/permissions");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch permissions');
  }
};

// Create permission
export const createPermission = async (permissionData) => {
  try {
    const res = await API.post("/permissions", permissionData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create permission');
  }
};

// Update permission
export const updatePermission = async (permissionId, permissionData) => {
  try {
    const res = await API.put(`/permissions/${permissionId}`, permissionData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update permission');
  }
};

// Delete permission
export const deletePermission = async (permissionId) => {
  try {
    const res = await API.delete(`/permissions/${permissionId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete permission');
  }
};
