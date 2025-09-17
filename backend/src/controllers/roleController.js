const Role = require("../models/Role");
const Permission = require("../models/Permission");

exports.list = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const exists = await Role.findOne({ name });
    if (exists) return res.status(409).json({ error: "role exists" });
    const r = await Role.create({ name, description, permissions: permissions || [] });
    const created = await Role.findById(r._id).populate("permissions");
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.get = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions");
    if (!role) return res.status(404).json({ error: "not found" });
    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (permissions) updateData.permissions = permissions;
    
    const updated = await Role.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate("permissions");
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// attach permission to role
exports.attachPermission = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionId } = req.body;
    const role = await Role.findById(roleId);
    const perm = await Permission.findById(permissionId);
    if (!role || !perm) return res.status(404).json({ error: "role or permission not found" });
    if (!role.permissions.includes(perm._id)) {
      role.permissions.push(perm._id);
      await role.save();
    }
    const updated = await Role.findById(roleId).populate("permissions");
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// detach permission
exports.detachPermission = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionId } = req.body;
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ error: "role not found" });
    role.permissions = role.permissions.filter((p) => p.toString() !== permissionId);
    await role.save();
    const updated = await Role.findById(roleId).populate("permissions");
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// get permissions of role
exports.getPermissions = async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId).populate("permissions");
    if (!role) return res.status(404).json({ error: "role not found" });
    res.json(role.permissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

