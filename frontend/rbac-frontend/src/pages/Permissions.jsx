import { useState, useEffect } from "react";
import { getPermissions, createPermission, updatePermission, deletePermission } from "../services/permissionService";
import { useAuth } from "../context/AuthContext";

const Permissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Check user permissions
  const userPermissions = user?.roles?.[0]?.permissions?.map(p => p.name) || [];
  const canManagePermissions = userPermissions.includes("manage_permissions");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleEdit = (permission) => {
    setEditMode(true);
    setSelectedPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (permissionId) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(permissionId);
        fetchPermissions();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updatePermission(selectedPermission._id || selectedPermission.id, formData);
      } else {
        await createPermission(formData);
      }
      fetchPermissions();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedPermission(null);
    setFormData({ name: '', description: '' });
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );
  }

  // Check if user has permission to manage permissions
  if (!canManagePermissions) {
    return (
      <div className="alert alert-warning">
        <span>You don't have permission to manage permissions. Contact admin for access.</span>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🔑 Permissions Management</h1>
          <p className="text-base-content/70 mt-1">Configure system permissions and access controls</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Permission
        </button>
      </div>

      <div className="stats stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Permissions</div>
          <div className="stat-value text-accent">{permissions.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">System Permissions</div>
          <div className="stat-value text-success">{permissions.length}</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">All Permissions</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission._id || permission.id}>
                    <td>
                      <div className="font-bold">{permission.name}</div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {permission.description || 'No description'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">
                        {permission.createdAt ? new Date(permission.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleEdit(permission)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => handleDelete(permission._id || permission.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editMode ? 'Edit Permission' : 'Add New Permission'}</h3>
            <div className="py-4 space-y-4">
              <input 
                type="text" 
                placeholder="Permission Name" 
                className="input input-bordered w-full" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                className="textarea textarea-bordered w-full"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleCloseModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editMode ? 'Update Permission' : 'Add Permission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Permissions;