const express = require("express");
const router = express.Router();
const nlController = require("../controllers/nlController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/rbacMiddleware");

// Natural language command processing - Admin only
router.post("/command", authMiddleware, requireRole("Admin"), nlController.processCommand);

module.exports = router;