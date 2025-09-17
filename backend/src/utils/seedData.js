const Role = require("../models/Role");
const Permission = require("../models/Permission");
const User = require("../models/User");
const { hashPassword } = require("./hash");

async function seedDefaultData() {
  try {
    // Create default permissions
    const permissions = [
      { name: "manage_all_users", description: "Full access to all users" },
      { name: "manage_roles", description: "Create, read, update, delete roles" },
      { name: "manage_permissions", description: "Create, read, update, delete permissions" },
      { name: "edit_users", description: "Edit user information" },
      { name: "view_users", description: "View user list" },
      { name: "view_own_profile", description: "View own profile only" },
      { name: "view_dashboard", description: "Access dashboard" }
    ];

    const createdPermissions = [];
    for (const perm of permissions) {
      const existing = await Permission.findOne({ name: perm.name });
      if (!existing) {
        const created = await Permission.create(perm);
        createdPermissions.push(created._id);
      } else {
        createdPermissions.push(existing._id);
      }
    }

    // Create Admin role - Full access
    let adminRole = await Role.findOne({ name: "Admin" });
    if (!adminRole) {
      adminRole = await Role.create({
        name: "Admin",
        description: "Full system access - can manage everything",
        permissions: createdPermissions // All permissions
      });
    }

    // Create Editor role - Can edit users only
    let editorRole = await Role.findOne({ name: "Editor" });
    if (!editorRole) {
      const editorPermissions = await Permission.find({ 
        name: { $in: ["edit_users", "view_users", "view_dashboard"] }
      });
      editorRole = await Role.create({
        name: "Editor",
        description: "Can edit users and view dashboard",
        permissions: editorPermissions.map(p => p._id)
      });
    }

    // Create User role - Own profile only
    let userRole = await Role.findOne({ name: "User" });
    if (!userRole) {
      const userPermissions = await Permission.find({ 
        name: { $in: ["view_own_profile", "view_dashboard"] }
      });
      userRole = await Role.create({
        name: "User",
        description: "Can only view own profile",
        permissions: userPermissions.map(p => p._id)
      });
    }

    // Create default test users if not exist
    const adminUser = await User.findOne({ email: "admin@admin.com" });
    if (!adminUser) {
      const hashedPassword = await require("./hash").hashPassword("admin123");
      await User.create({
        email: "admin@admin.com",
        password: hashedPassword,
        roles: [adminRole._id]
      });
      console.log("Default admin user created: admin@admin.com / admin123");
    }
    
    const editorUser = await User.findOne({ email: "editor@editor.com" });
    if (!editorUser) {
      const hashedPassword = await require("./hash").hashPassword("editor123");
      await User.create({
        email: "editor@editor.com",
        password: hashedPassword,
        roles: [editorRole._id]
      });
      console.log("Default editor user created: editor@editor.com / editor123");
    }
    
    const testUser = await User.findOne({ email: "user@user.com" });
    if (!testUser) {
      const hashedPassword = await require("./hash").hashPassword("user123");
      await User.create({
        email: "user@user.com",
        password: hashedPassword,
        roles: [userRole._id]
      });
      console.log("Default user created: user@user.com / user123");
    }
    
    console.log("Default roles and permissions created");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = { seedDefaultData };