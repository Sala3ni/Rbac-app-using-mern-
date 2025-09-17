const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole, requirePermission } = require("../middleware/rbacMiddleware");

// Users with manage_permissions OR manage_roles can view permissions
router.get("/", authMiddleware, async (req, res, next) => {
  const { userHasPermission } = require("../middleware/rbacMiddleware");
  const canManagePermissions = await userHasPermission(req.user.userId, "manage_permissions");
  const canManageRoles = await userHasPermission(req.user.userId, "manage_roles");
  
  if (canManagePermissions || canManageRoles) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}, permissionController.list);
router.post("/", authMiddleware, requirePermission("manage_permissions"), permissionController.create);
router.get("/:id", authMiddleware, requirePermission("manage_permissions"), permissionController.get);
router.put("/:id", authMiddleware, requirePermission("manage_permissions"), permissionController.update);
router.delete("/:id", authMiddleware, requirePermission("manage_permissions"), permissionController.remove);

module.exports = router;
