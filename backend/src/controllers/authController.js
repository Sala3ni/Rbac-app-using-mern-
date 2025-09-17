const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signJwt } = require("../utils/jwt");

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ error: "email, password & role required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "email already registered" });

    // Get selected role
    const Role = require("../models/Role");
    const selectedRole = await Role.findOne({ name: role });
    if (!selectedRole) return res.status(400).json({ error: "Invalid role selected" });
    
    const hashed = await hashPassword(password);
    const user = await User.create({ 
      email, 
      password: hashed,
      roles: [selectedRole._id]
    });
    
    // Get user with populated roles
    const userWithRoles = await User.findById(user._id).populate({
      path: "roles",
      populate: { path: "permissions" }
    });
    
    const token = signJwt({ userId: user._id.toString() });
    res.json({ user: { id: userWithRoles._id, email: userWithRoles.email, roles: userWithRoles.roles }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password: password ? "[PROVIDED]" : "[MISSING]" });
    
    if (!email || !password) return res.status(400).json({ error: "email & password required" });

    const user = await User.findOne({ email }).populate({
      path: "roles",
      populate: { path: "permissions" }
    });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    console.log("User found:", user.email);
    const ok = await comparePassword(password, user.password);
    console.log("Password match:", ok);
    
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt({ userId: user._id.toString() });
    res.json({ user: { id: user._id, email: user.email, roles: user.roles }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: "roles",
      populate: { path: "permissions" }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user._id, email: user.email, roles: user.roles } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
