import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await login(form);
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
          <h2 className="card-title justify-center">🔐 Login</h2>
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
            <button 
              className="btn btn-primary w-full" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm">Don't have an account? </span>
            <Link to="/register" className="link link-primary">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;