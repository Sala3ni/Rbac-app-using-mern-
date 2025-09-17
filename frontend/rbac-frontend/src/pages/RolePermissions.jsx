import { useState, useEffect } from "react";
import { getRoles, attachPermission, detachPermission } from "../services/roleService";
import { getPermissions } from "../services/permissionService";

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleAttachPermission = async (roleId, permissionId) => {
    try {
      await attachPermission(roleId, permissionId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDetachPermission = async (roleId, permissionId) => {
    try {
      await detachPermission(roleId, permissionId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const hasPermission = (role, permissionId) => {
    return role.permissions?.some(p => (p._id || p.id) === permissionId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">🔗 Role-Permission Management</h1>
        <p className="text-base-content/70 mt-1">Connect permissions to roles visually</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🎭 Roles</h2>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role._id || role.id}
                  className={`btn w-full justify-start ${
                    selectedRole?._id === role._id ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <span className="font-bold">{role.name}</span>
                  <span className="badge badge-sm">
                    {role.permissions?.length || 0} permissions
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Assignment */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              🔑 Permissions for {selectedRole?.name || "Select a Role"}
            </h2>
            
            {selectedRole ? (
              <div className="space-y-3">
                {permissions.map((permission) => {
                  const isAssigned = hasPermission(selectedRole, permission._id || permission.id);
                  
                  return (
                    <div key={permission._id || permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold">{permission.name}</div>
                        <div className="text-sm opacity-70">{permission.description}</div>
                      </div>
                      
                      <button
                        className={`btn btn-sm ${
                          isAssigned ? 'btn-error' : 'btn-success'
                        }`}
                        onClick={() => 
                          isAssigned 
                            ? handleDetachPermission(selectedRole._id || selectedRole.id, permission._id || permission.id)
                            : handleAttachPermission(selectedRole._id || selectedRole.id, permission._id || permission.id)
                        }
                      >
                        {isAssigned ? '➖ Remove' : '➕ Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 opacity-50">
                Select a role to manage its permissions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Permission Overview */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">📊 Permission Overview</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Permission</th>
                  {roles.map(role => (
                    <th key={role._id || role.id} className="text-center">{role.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map(permission => (
                  <tr key={permission._id || permission.id}>
                    <td>
                      <div className="font-semibold">{permission.name}</div>
                      <div className="text-sm opacity-70">{permission.description}</div>
                    </td>
                    {roles.map(role => (
                      <td key={role._id || role.id} className="text-center">
                        {hasPermission(role, permission._id || permission.id) ? (
                          <span className="badge badge-success">✓</span>
                        ) : (
                          <span className="badge badge-ghost">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;