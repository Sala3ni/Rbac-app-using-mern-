const Permission = require("../models/Permission");

exports.list = async (req, res) => {
  try {
    const perms = await Permission.find().sort({ createdAt: -1 });
    res.json(perms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const exists = await Permission.findOne({ name });
    if (exists) return res.status(409).json({ error: "permission exists" });
    const p = await Permission.create({ name, description });
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.get = async (req, res) => {
  try {
    const p = await Permission.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Permission.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Permission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
