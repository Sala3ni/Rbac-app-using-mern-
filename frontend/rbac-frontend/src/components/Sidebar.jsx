import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Get user permissions
  const userPermissions = user?.roles?.[0]?.permissions?.map(p => p.name) || [];
  const userRole = user?.roles?.[0]?.name || "User";
  
  const menuItems = [
    { path: "/", name: "Dashboard", icon: "📊", requiredPermission: "view_dashboard" },
    { path: "/users", name: "Users", icon: "👥", requiredPermissions: ["view_users", "edit_users", "manage_all_users"] },
    { path: "/roles", name: "Roles", icon: "🎭", requiredPermission: "manage_roles" },
    { path: "/permissions", name: "Permissions", icon: "🔑", requiredPermission: "manage_permissions" },
    { path: "/role-permissions", name: "Role-Permissions", icon: "🔗", requiredPermission: "manage_roles" },
    { path: "/admin-config", name: "Admin Config", icon: "⚙️", requiredPermission: "manage_permissions" },
    { path: "/profile", name: "My Profile", icon: "👤", requiredPermission: "view_own_profile" }
  ];
  
  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => {
    // Dashboard and Profile are always available
    if (item.path === "/" || item.path === "/profile") return true;
    
    // Check multiple permissions for Users page
    if (item.requiredPermissions) {
      return item.requiredPermissions.some(perm => userPermissions.includes(perm));
    }
    
    // Check single permission
    return userPermissions.includes(item.requiredPermission);
  });

  return (
    <aside className="w-64 min-h-full bg-base-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-base-content">Navigation</h2>
        <ul className="menu menu-vertical w-full">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`flex items-center gap-3 ${location.pathname === item.path ? 'active bg-primary text-primary-content' : 'hover:bg-base-300'}`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Role indicator */}
        <div className="mt-4 p-2 bg-base-300 rounded">
          <div className="text-xs text-base-content/70">Role:</div>
          <div className="font-semibold text-sm">
            <span className={`badge ${
              userRole === "Admin" ? "badge-error" :
              userRole === "Editor" ? "badge-warning" : "badge-info"
            }`}>
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
