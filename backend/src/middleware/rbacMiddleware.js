// helper to check if user has a named permission
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

async function userHasPermission(userId, permissionName) {
  const user = await User.findById(userId).populate({
    path: "roles",
    populate: { path: "permissions" },
  });
  if (!user) return false;
  for (const r of user.roles) {
    if (!r.permissions) continue;
    for (const p of r.permissions) {
      if (p.name === permissionName) return true;
    }
  }
  return false;
}

function requirePermission(permissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const ok = await userHasPermission(userId, permissionName);
      if (!ok) return res.status(403).json({ error: "Forbidden" });
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
}

// Check if user has specific role
async function userHasRole(userId, roleName) {
  const user = await User.findById(userId).populate("roles");
  if (!user) return false;
  return user.roles.some(role => role.name === roleName);
}

// Require specific role
function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const hasRole = await userHasRole(userId, roleName);
      if (!hasRole) return res.status(403).json({ error: "Access denied: Insufficient role" });
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
}

// Check if user can access other user's data
function canAccessUser() {
  return async (req, res, next) => {
    try {
      const currentUserId = req.user.userId;
      const targetUserId = req.params.id;
      
      // Admin can access anyone
      if (await userHasRole(currentUserId, "Admin")) {
        return next();
      }
      
      // Editor can access all users (full user management access)
      if (await userHasRole(currentUserId, "Editor")) {
        return next();
      }
      
      // Regular users can only access themselves
      if (currentUserId === targetUserId) {
        return next();
      }
      
      return res.status(403).json({ error: "You can only access your own profile" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
}

module.exports = { requirePermission, userHasPermission, requireRole, userHasRole, canAccessUser };
