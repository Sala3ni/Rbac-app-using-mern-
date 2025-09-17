import { useState, useEffect } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../services/roleService";
import { getPermissions } from "../services/permissionService";
import { useAuth } from "../context/AuthContext";

const Roles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Check user permissions
  const userPermissions = user?.roles?.[0]?.permissions?.map(p => p.name) || [];
  const canManageRoles = userPermissions.includes("manage_roles");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = (index) => {
    const colors = ["bg-error", "bg-warning", "bg-info", "bg-success", "bg-accent"];
    return colors[index % colors.length];
  };

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });

  const handleEdit = (role) => {
    setEditMode(true);
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions?.map(p => p._id || p.id) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateRole(selectedRole._id || selectedRole.id, formData);
      } else {
        await createRole(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedRole(null);
    setFormData({ name: '', description: '', permissions: [] });
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

  // Check if user has permission to manage roles
  if (!canManageRoles) {
    return (
      <div className="alert alert-warning">
        <span>You don't have permission to manage roles. Contact admin for access.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">🎭 Roles Management</h1>
          <p className="text-base-content/70 mt-1">Define and manage user roles</p>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowModal(true)}
        >
          ➕ Create Role
        </button>
      </div>

      <div className="stats stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Roles</div>
          <div className="stat-value text-secondary">{roles.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Permissions</div>
          <div className="stat-value text-accent">{permissions.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <div key={role._id || role.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full ${getRandomColor(index)}`}></div>
                <h2 className="card-title text-xl">{role.name}</h2>
              </div>
              
              <p className="text-base-content/70 mb-4">{role.description || 'No description'}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions?.map((perm) => (
                    <span key={perm._id || perm.id || perm} className="badge badge-outline badge-sm">
                      {perm.name || perm}
                    </span>
                  )) || <span className="text-sm text-gray-500">No permissions</span>}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-base-content/60">
                  Role ID: {role._id || role.id}
                </span>
                <div className="card-actions">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEdit(role)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleDelete(role._id || role.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editMode ? 'Edit Role' : 'Create New Role'}</h3>
            <div className="py-4 space-y-4">
              <input 
                type="text" 
                placeholder="Role Name" 
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
              <div>
                <label className="label">Select Permissions:</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {permissions.map((perm) => (
                    <label key={perm._id || perm.id} className="cursor-pointer label">
                      <span className="label-text">{perm.name}</span>
                      <input 
                        type="checkbox" 
                        className="checkbox" 
                        checked={formData.permissions.includes(perm._id || perm.id)}
                        onChange={(e) => {
                          const permId = perm._id || perm.id;
                          if (e.target.checked) {
                            setFormData({...formData, permissions: [...formData.permissions, permId]});
                          } else {
                            setFormData({...formData, permissions: formData.permissions.filter(p => p !== permId)});
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleCloseModal}>Cancel</button>
              <button className="btn btn-secondary" onClick={handleSubmit}>
                {editMode ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Roles;