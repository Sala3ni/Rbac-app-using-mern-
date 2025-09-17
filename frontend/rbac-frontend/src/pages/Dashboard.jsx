import { useState, useEffect } from "react";
import { getUsers } from "../services/userService";
import { getRoles } from "../services/roleService";
import { getPermissions } from "../services/permissionService";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Get user role
  const userRole = user?.roles?.[0]?.name || "User";
  
  // Show different dashboards based on role
  if (userRole === "User") {
    return <UserDashboard />;
  }
  
  // Admin and Editor get management dashboard
  const isAdmin = userRole === "Admin";
  const [stats, setStats] = useState({ users: 0, roles: 0, permissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersData, rolesData, permissionsData] = await Promise.all([
        getUsers().catch(() => []),
        getRoles().catch(() => []),
        getPermissions().catch(() => [])
      ]);
      
      setStats({
        users: usersData.length,
        roles: rolesData.length,
        permissions: permissionsData.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg">
        <div className="hero-content text-center py-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Permissions & Roles Configurator</h1>
            <p className="text-lg opacity-90">
              Welcome {userRole}! {isAdmin ? "Full RBAC management access" : "Limited system access"} 🚀
            </p>
          </div>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <span className="text-3xl">👥</span>
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">
            {loading ? '...' : stats.users}
          </div>
          <div className="stat-desc">Active users in system</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <span className="text-3xl">🎭</span>
          </div>
          <div className="stat-title">Roles</div>
          <div className="stat-value text-secondary">
            {loading ? '...' : stats.roles}
          </div>
          <div className="stat-desc">Different role types</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <span className="text-3xl">🔑</span>
          </div>
          <div className="stat-title">Permissions</div>
          <div className="stat-value text-accent">
            {loading ? '...' : stats.permissions}
          </div>
          <div className="stat-desc">Total permissions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🔑 Your Permissions</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {user?.roles?.[0]?.permissions?.length > 0 ? (
                user.roles[0].permissions.map(perm => (
                  <div key={perm._id} className="alert alert-success alert-sm">
                    <span className="text-sm">
                      <strong>{perm.name}</strong> - {perm.description}
                    </span>
                  </div>
                ))
              ) : (
                <div className="alert alert-info">
                  <span>No specific permissions assigned</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">⚙️ Available Actions</h2>
            <div className="space-y-2">
              {user?.roles?.[0]?.permissions?.map(perm => {
                const actionMap = {
                  'manage_all_users': { icon: '👥', text: 'Manage All Users', color: 'btn-primary' },
                  'manage_roles': { icon: '🎭', text: 'Manage Roles', color: 'btn-secondary' },
                  'manage_permissions': { icon: '🔑', text: 'Manage Permissions', color: 'btn-accent' },
                  'edit_users': { icon: '✏️', text: 'Edit Users', color: 'btn-warning' },
                  'view_users': { icon: '👀', text: 'View Users', color: 'btn-info' },
                  'view_dashboard': { icon: '📊', text: 'View Dashboard', color: 'btn-success' },
                  'view_own_profile': { icon: '👤', text: 'View Profile', color: 'btn-ghost' }
                };
                const action = actionMap[perm.name];
                return action ? (
                  <button key={perm._id} className={`btn btn-sm ${action.color} w-full justify-start`}>
                    {action.icon} {action.text}
                  </button>
                ) : null;
              }) || (
                <div className="alert alert-info">
                  <span>No actions available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;