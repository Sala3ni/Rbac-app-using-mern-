const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", RoleSchema);
