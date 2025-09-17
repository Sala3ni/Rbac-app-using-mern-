import { useState } from "react";
import NaturalLanguageConfig from "../components/NaturalLanguageConfig";
// Backend handles all command processing via API

const AdminConfig = () => {
  const [message, setMessage] = useState("");

  // Backend now handles all command processing

  return (
    <div className="space-y-6">
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg">
        <div className="hero-content text-center py-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">⚙️ Admin Configuration</h1>
            <p className="text-lg opacity-90">Advanced RBAC management with natural language commands</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          <span>{message}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NaturalLanguageConfig />
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📋 Quick Actions</h2>
            <div className="space-y-3">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Command Examples</div>
                <div className="stat-desc space-y-1">
                  <div>• Create permission called 'view reports'</div>
                  <div>• Create role called 'Manager'</div>
                  <div>• Give role 'Editor' permission to 'edit users'</div>
                </div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Supported Actions</div>
                <div className="stat-desc space-y-1">
                  <div>✅ Create permissions</div>
                  <div>✅ Create roles</div>
                  <div>✅ Assign permissions to roles</div>
                  <div>🔄 More commands coming soon...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🎯 RBAC Management Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-primary text-primary-content rounded-lg">
              <div className="stat-figure">🔑</div>
              <div className="stat-title">Permission Management</div>
              <div className="stat-desc">Create, edit, delete permissions</div>
            </div>
            
            <div className="stat bg-secondary text-secondary-content rounded-lg">
              <div className="stat-figure">🎭</div>
              <div className="stat-title">Role Management</div>
              <div className="stat-desc">Manage roles and their permissions</div>
            </div>
            
            <div className="stat bg-accent text-accent-content rounded-lg">
              <div className="stat-figure">👥</div>
              <div className="stat-title">User Management</div>
              <div className="stat-desc">Assign roles to users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;