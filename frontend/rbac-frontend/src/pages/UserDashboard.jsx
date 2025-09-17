import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="hero bg-gradient-to-r from-info to-success text-white rounded-lg">
        <div className="hero-content text-center py-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Permissions & Roles System</h1>
            <p className="text-lg opacity-90">Welcome User! View your assigned permissions and profile</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">👤 Your Profile</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email} <span className="badge badge-ghost">Cannot be changed</span></p>
              <p><strong>Role:</strong> {user?.roles?.[0]?.name || "User"}</p>
              <p><strong>Status:</strong> <span className="badge badge-success">Active</span></p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🔑 Your Permissions</h2>
            <div className="space-y-2">
              {user?.roles?.[0]?.permissions?.length > 0 ? (
                user.roles[0].permissions.map(perm => (
                  <div key={perm._id || perm.id} className="alert alert-info alert-sm">
                    <span className="text-sm">
                      <strong>{perm.name}</strong><br/>
                      <small className="opacity-70">{perm.description}</small>
                    </span>
                  </div>
                ))
              ) : (
                <div className="alert alert-warning">
                  <span>No permissions assigned by admin</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">📋 What You Can Do</h2>
          <div className="space-y-3 mt-4">
            {user?.roles?.[0]?.permissions?.map(perm => {
              const permissionActions = {
                'view_dashboard': { icon: '📊', text: 'Access Dashboard', desc: 'View system information' },
                'view_own_profile': { icon: '👤', text: 'Manage Profile', desc: 'View and edit your profile' },
                'view_users': { icon: '👥', text: 'View Users', desc: 'See user list' },
                'edit_users': { icon: '✏️', text: 'Edit Users', desc: 'Modify user information' },
                'manage_all_users': { icon: '👥', text: 'Full User Management', desc: 'Complete user control' },
                'manage_roles': { icon: '🎭', text: 'Role Management', desc: 'Create and edit roles' },
                'manage_permissions': { icon: '🔑', text: 'Permission Management', desc: 'Control system permissions' }
              };
              const action = permissionActions[perm.name];
              return action ? (
                <div key={perm._id} className="stat bg-base-200 rounded-lg">
                  <div className="stat-figure text-2xl">{action.icon}</div>
                  <div className="stat-title">{action.text}</div>
                  <div className="stat-value text-lg">✅</div>
                  <div className="stat-desc">{action.desc}</div>
                </div>
              ) : null;
            }) || (
              <div className="alert alert-warning">
                <span>No specific actions available. Contact admin for permissions.</span>
              </div>
            )}
            
            {/* Always available - password change */}
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-2xl">🔒</div>
              <div className="stat-title">Change Password</div>
              <div className="stat-value text-lg">✅</div>
              <div className="stat-desc">Update your account password</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;