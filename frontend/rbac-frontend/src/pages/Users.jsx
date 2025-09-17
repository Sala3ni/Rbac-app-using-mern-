import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService";
import { getRoles } from "../services/roleService";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  
  // Get user permissions
  const userPermissions = user?.roles?.[0]?.permissions?.map(p => p.name) || [];
  const currentUserRole = user?.roles?.[0]?.name || "User";
  
  // Check permissions instead of roles
  const canManageAllUsers = userPermissions.includes("manage_all_users");
  const canEditUsers = userPermissions.includes("edit_users");
  const canViewUsers = userPermissions.includes("view_users");
  
  // User can access if they have any user-related permission
  const hasUserAccess = canManageAllUsers || canEditUsers || canViewUsers;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      
      // Try to fetch roles, fallback to basic roles if access denied
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (roleError) {
        console.warn('Cannot fetch roles:', roleError.message);
        // Fallback to basic role names if no access
        setRoles([
          { _id: 'admin', name: 'Admin' },
          { _id: 'editor', name: 'Editor' },
          { _id: 'user', name: 'User' },
          { _id: 'manager', name: 'Manager' },
          { _id: 'support', name: 'SUPPORT AGENT' }
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });

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

  // Check if user has access to Users page
  if (!hasUserAccess) {
    return (
      <div className="alert alert-warning">
        <span>You don't have permission to access Users management. Contact admin for access.</span>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "badge-error",
      Editor: "badge-warning", 
      User: "badge-info"
    };
    return colors[role] || "badge-neutral";
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    
    // Both Admin and Editor can only edit roles
    setFormData({
      email: user.email,
      password: '',
      role: user.roles?.[0]?.name || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        let updateData = {};
        
        if (canEditUsers || canManageAllUsers) {
          // Users with edit permission can only update role
          updateData = { role: formData.role };
        }
        
        await updateUser(selectedUser.id, updateData);
      } else {
        await createUser(formData);
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
    setSelectedUser(null);
    setFormData({ email: '', password: '', role: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">👥 Users Management</h1>
          <p className="text-base-content/70 mt-1">Manage system users and their roles</p>
        </div>
        {(canEditUsers || canManageAllUsers) && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            ➕ Add User
          </button>
        )}
      </div>

      <div className="stats stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{users.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Roles</div>
          <div className="stat-value text-success">{roles.length}</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-12">
                            <span>{user.email?.charAt(0)?.toUpperCase() || 'U'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.email}</div>
                          <div className="text-sm opacity-50">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map(role => (
                          <span key={role._id || role.id} className={`badge ${getRoleBadge(role.name)}`}>
                            {role.name}
                          </span>
                        )) || <span className="badge badge-ghost">No roles</span>}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {(canEditUsers || canManageAllUsers) && (
                          <>
                            <button 
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleEdit(user)}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="btn btn-ghost btn-xs text-error"
                              onClick={() => handleDelete(user.id)}
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                        {!canEditUsers && !canManageAllUsers && canViewUsers && (
                          <button className="btn btn-ghost btn-xs">👁️ View Profile</button>
                        )}
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
            <h3 className="font-bold text-lg">{editMode ? 'Edit User' : 'Add New User'}</h3>
            <div className="py-4 space-y-4">
              {/* Users with edit permission can only edit roles */}
              {(canEditUsers || canManageAllUsers) && editMode ? (
                <>
                  <div className="alert alert-info">
                    <span>You can only change user roles</span>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="input input-bordered w-full" 
                    value={formData.email}
                    disabled
                  />
                  <select 
                    className="select select-bordered w-full"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role._id || role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                /* New user creation only */
                <>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="input input-bordered w-full" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    type="password" 
                    placeholder={editMode ? "New Password (optional)" : "Password"} 
                    className="input input-bordered w-full" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <select 
                    className="select select-bordered w-full"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role._id || role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleCloseModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editMode ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Users;