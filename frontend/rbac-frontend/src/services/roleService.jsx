import API from "./api";

// Get all roles
export const getRoles = async () => {
  try {
    const res = await API.get("/roles");
    return res.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Access denied: Insufficient permissions to view roles');
    }
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch roles');
  }
};

// Create new role
export const createRole = async (data) => {
  try {
    const res = await API.post("/roles", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create role');
  }
};

// Update role
export const updateRole = async (id, data) => {
  try {
    const res = await API.put(`/roles/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update role');
  }
};

// Delete role
export const deleteRole = async (id) => {
  try {
    const res = await API.delete(`/roles/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete role');
  }
};

// Attach permission to role
export const attachPermission = async (roleId, permissionId) => {
  try {
    const res = await API.post(`/roles/${roleId}/permissions`, { permissionId });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to attach permission');
  }
};

// Get permissions of role
export const getRolePermissions = async (roleId) => {
  try {
    const res = await API.get(`/roles/${roleId}/permissions`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch role permissions');
  }
};

// Detach permission from role
export const detachPermission = async (roleId, permissionId) => {
  try {
    const res = await API.post(`/roles/${roleId}/permissions/detach`, { permissionId });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to detach permission');
  }
};
