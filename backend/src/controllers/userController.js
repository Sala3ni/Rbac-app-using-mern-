const User = require("../models/User");
const Role = require("../models/Role");
const { userHasRole } = require("../middleware/rbacMiddleware");

exports.list = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    
    // Check current user's role
    const isAdmin = await userHasRole(currentUserId, "Admin");
    const isEditor = await userHasRole(currentUserId, "Editor");
    
    if (isAdmin) {
      // Admin can see all users
      const users = await User.find().populate("roles", "name");
      const data = users.map(u => ({ id: u._id, email: u.email, roles: u.roles }));
      return res.json(data);
    }
    
    if (isEditor) {
      // Editor can see all users (full access to user management)
      const users = await User.find().populate("roles", "name");
      const data = users.map(u => ({ id: u._id, email: u.email, roles: u.roles }));
      return res.json(data);
    }
    
    // Regular users can only see themselves
    const user = await User.findById(currentUserId).populate("roles", "name");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json([{ id: user._id, email: user.email, roles: user.roles }]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// assign role to user
exports.assignRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roleId } = req.body;
    const user = await User.findById(userId);
    const role = await Role.findById(roleId);
    if (!user || !role) return res.status(404).json({ error: "user or role not found" });
    if (!user.roles.includes(role._id)) {
      user.roles.push(role._id);
      await user.save();
    }
    const updated = await User.findById(userId).populate("roles");
    res.json({ id: updated._id, email: updated.email, roles: updated.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("roles", "name");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user._id, email: user.email, roles: user.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password and role required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const selectedRole = await Role.findOne({ name: role });
    if (!selectedRole) return res.status(400).json({ error: "Invalid role" });

    const { hashPassword } = require("../utils/hash");
    const hashedPassword = await hashPassword(password);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      roles: [selectedRole._id]
    });

    const newUser = await User.findById(user._id).populate("roles", "name");
    res.status(201).json({ id: newUser._id, email: newUser.email, roles: newUser.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { email, role, password } = req.body;
    const currentUserId = req.user.userId;
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    const { userHasRole } = require("../middleware/rbacMiddleware");
    const isAdmin = await userHasRole(currentUserId, "Admin");
    const isEditor = await userHasRole(currentUserId, "Editor");
    const isSelfUpdate = currentUserId === targetUserId;

    // Admin and Editor can only change roles of other users
    if ((isAdmin || isEditor) && !isSelfUpdate) {
      if (role) {
        const selectedRole = await Role.findOne({ name: role });
        if (!selectedRole) return res.status(400).json({ error: "Invalid role" });
        user.roles = [selectedRole._id];
      }
    }
    // Self update - can only change password
    else if (isSelfUpdate) {
      if (password) {
        const { hashPassword } = require("../utils/hash");
        user.password = await hashPassword(password);
      }
      // Users cannot change their own email
    }
    else {
      return res.status(403).json({ error: "Access denied" });
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate("roles", "name");
    res.json({ id: updatedUser._id, email: updatedUser.email, roles: updatedUser.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserRoles = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("roles");
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json(user.roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
