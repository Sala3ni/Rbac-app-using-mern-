const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole, canAccessUser, userHasRole } = require("../middleware/rbacMiddleware");

// List users - Admin & Editor can see all, User sees own only
router.get("/", authMiddleware, userController.list);

// Create user - Admin & Editor can create
router.post("/", authMiddleware, async (req, res, next) => {
  const isAdmin = await userHasRole(req.user.userId, "Admin");
  const isEditor = await userHasRole(req.user.userId, "Editor");
  if (isAdmin || isEditor) return next();
  return res.status(403).json({ error: "Access denied" });
}, userController.createUser);

// Update user - Admin & Editor can update, User can update own profile
router.put("/:id", authMiddleware, async (req, res, next) => {
  const currentUserId = req.user.userId;
  const targetUserId = req.params.id;
  const isAdmin = await userHasRole(currentUserId, "Admin");
  const isEditor = await userHasRole(currentUserId, "Editor");
  
  if (isAdmin || isEditor || currentUserId === targetUserId) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}, userController.updateUser);

// Delete user - Admin & Editor can delete
router.delete("/:id", authMiddleware, async (req, res, next) => {
  const isAdmin = await userHasRole(req.user.userId, "Admin");
  const isEditor = await userHasRole(req.user.userId, "Editor");
  if (isAdmin || isEditor) return next();
  return res.status(403).json({ error: "Access denied" });
}, userController.deleteUser);

// Get single user
router.get("/:id", authMiddleware, canAccessUser(), userController.getUser);

// Role assignment - Only Admin
router.post("/:id/roles", authMiddleware, requireRole("Admin"), userController.assignRole);
router.get("/:id/roles", authMiddleware, canAccessUser(), userController.getUserRoles);

module.exports = router;
