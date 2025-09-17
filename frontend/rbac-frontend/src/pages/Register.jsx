import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // No need to fetch roles from API for registration
  const [roles] = useState([
    { _id: "admin", name: "Admin" },
    { _id: "editor", name: "Editor" },
    { _id: "user", name: "User" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) {
      setError("Please fill all fields including role");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await signup(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">📝 Register</h2>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email"
              className="input input-bordered w-full mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password"
              className="input input-bordered w-full mb-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select 
              className="select select-bordered w-full mb-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary w-full" 
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm">Already have an account? </span>
            <Link to="/login" className="link link-primary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;