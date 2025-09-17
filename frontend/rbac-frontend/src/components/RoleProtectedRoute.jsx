import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Check if user has required role
  const hasRequiredRole = user.roles?.some(role => 
    allowedRoles.includes(role.name)
  );
  
  if (!hasRequiredRole) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-error max-w-md">
          <span>🚫 Access Denied: You don't have permission to view this page</span>
        </div>
      </div>
    );
  }
  
  return children;
};

export default RoleProtectedRoute;