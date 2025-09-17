const mongoose = require("mongoose");
const { Schema } = mongoose;

const PermissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Permission", PermissionSchema);
