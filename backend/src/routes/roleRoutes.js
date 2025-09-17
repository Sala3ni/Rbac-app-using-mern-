const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole, requirePermission } = require("../middleware/rbacMiddleware");

// Users with role management OR user management can view roles
router.get("/", authMiddleware, async (req, res, next) => {
  const { userHasPermission } = require("../middleware/rbacMiddleware");
  const canManageRoles = await userHasPermission(req.user.userId, "manage_roles");
  const canManageUsers = await userHasPermission(req.user.userId, "manage_all_users");
  const canEditUsers = await userHasPermission(req.user.userId, "edit_users");
  const canViewUsers = await userHasPermission(req.user.userId, "view_users");
  
  if (canManageRoles || canManageUsers || canEditUsers || canViewUsers) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}, roleController.list);

router.post("/", authMiddleware, requirePermission("manage_roles"), roleController.create);
router.get("/:id", authMiddleware, requirePermission("manage_roles"), roleController.get);
router.put("/:id", authMiddleware, requirePermission("manage_roles"), roleController.update);
router.delete("/:id", authMiddleware, requirePermission("manage_roles"), roleController.remove);

// attach/detach permissions
router.post("/:roleId/permissions", authMiddleware, requirePermission("manage_roles"), roleController.attachPermission);
router.post("/:roleId/permissions/detach", authMiddleware, requirePermission("manage_roles"), roleController.detachPermission);

// get permissions for role
router.get("/:roleId/permissions", authMiddleware, requirePermission("manage_roles"), roleController.getPermissions);

module.exports = router;
