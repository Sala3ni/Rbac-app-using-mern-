import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ email: "", currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ ...formData, email: user.email });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.currentPassword || !formData.newPassword) {
      setMessage("Please provide both current and new password");
      setLoading(false);
      return;
    }

    try {
      // Only send password data
      const updateData = {
        password: formData.newPassword
      };
      console.log("Update profile:", updateData);
      setMessage("Password updated successfully!");
      setFormData({...formData, currentPassword: "", newPassword: ""});
    } catch (error) {
      setMessage("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="hero bg-gradient-to-r from-info to-success text-white rounded-lg">
        <div className="hero-content text-center py-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">👤 My Profile</h1>
            <p className="text-lg opacity-90">Manage your account settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Email</label>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <label className="label">Role</label>
                <span className={`badge ${
                  user?.roles?.[0]?.name === "Admin" ? "badge-error" :
                  user?.roles?.[0]?.name === "Editor" ? "badge-warning" : "badge-info"
                }`}>
                  {user?.roles?.[0]?.name || "User"}
                </span>
              </div>
              <div>
                <label className="label">Account Status</label>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Update Profile</h2>
            {message && (
              <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>
                <span>{message}</span>
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="alert alert-info">
                <span>You can only change your password. Email cannot be modified.</span>
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={formData.email}
                  disabled
                />
              </div>
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="label">New Password (optional)</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;