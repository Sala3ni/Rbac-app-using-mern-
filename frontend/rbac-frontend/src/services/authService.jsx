import API from "./api";

// Signup
export const signup = async (userData) => {
  try {
    const res = await API.post("/auth/signup", userData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signup failed');
  }
};

// Login
export const login = async (userData) => {
  try {
    console.log("Frontend sending login data:", userData);
    const res = await API.post("/auth/login", userData);
    console.log("Login response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// Current user (protected route)
export const getCurrentUser = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get user info');
  }
};
