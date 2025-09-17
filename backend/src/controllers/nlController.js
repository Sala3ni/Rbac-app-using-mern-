const { GoogleGenerativeAI } = require("@google/generative-ai");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your-api-key-here");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// RBAC Functions
const rbac = {
  async createPermission({ name, description }) {
    const existing = await Permission.findOne({ name });
    if (existing) throw new Error(`Permission '${name}' already exists`);
    
    const permission = await Permission.create({ name, description: description || `Permission to ${name}` });
    return { ok: true, permission };
  },

  async createRole({ name, description }) {
    const existing = await Role.findOne({ name });
    if (existing) throw new Error(`Role '${name}' already exists`);
    
    const role = await Role.create({ name, description: description || `${name} role` });
    return { ok: true, role };
  },

  async assignPermissionToRole({ roleName, permissionName }) {
    const role = await Role.findOne({ name: roleName });
    const permission = await Permission.findOne({ name: permissionName });
    
    if (!role) throw new Error(`Role '${roleName}' not found`);
    if (!permission) throw new Error(`Permission '${permissionName}' not found`);
    
    if (!role.permissions.includes(permission._id)) {
      role.permissions.push(permission._id);
      await role.save();
    }
    
    return { ok: true, assigned: { roleName, permissionName } };
  },

  async revokePermissionFromRole({ roleName, permissionName }) {
    const role = await Role.findOne({ name: roleName });
    const permission = await Permission.findOne({ name: permissionName });
    
    if (!role) throw new Error(`Role '${roleName}' not found`);
    if (!permission) throw new Error(`Permission '${permissionName}' not found`);
    
    role.permissions = role.permissions.filter(p => p.toString() !== permission._id.toString());
    await role.save();
    
    return { ok: true, revoked: { roleName, permissionName } };
  }
};

// Improved fallback parsing function
function parseCommandLocally(command) {
  const lower = command.toLowerCase().trim();
  console.log("Parsing command locally:", command);
  
  // Create permission - natural language patterns
  if (lower.includes("permission") && (lower.includes("create") || lower.includes("make") || lower.includes("add"))) {
    // Extract permission name from various patterns
    let name = null;
    
    // "Create a permission for viewing reports"
    let match = command.match(/(?:create|make|add).*permission.*for ([\w\s]+)/i);
    if (match) name = match[1].trim();
    
    // "Create permission called 'name'"
    if (!name) {
      match = command.match(/(?:create|make|add).*permission.*called ['"]?([^'"]+)['"]?/i);
      if (match) name = match[1].trim();
    }
    
    // "Create permission name"
    if (!name) {
      match = command.match(/(?:create|make|add).*permission ([\w\s]+)/i);
      if (match) name = match[1].trim();
    }
    
    if (name) {
      console.log("Found create permission:", name);
      return {
        action: "create_permission",
        name: name,
        description: `Permission to ${name}`
      };
    }
  }
  
  // Create role - natural language patterns
  if (lower.includes("role") && (lower.includes("create") || lower.includes("make") || lower.includes("add"))) {
    let name = null;
    
    // "Make a new role called Manager"
    let match = command.match(/(?:create|make|add).*role.*called ['"]?([^'"]+)['"]?/i);
    if (match) name = match[1].trim();
    
    // "Create Manager role"
    if (!name) {
      match = command.match(/(?:create|make|add) ([\w\s]+) role/i);
      if (match) name = match[1].trim();
    }
    
    // "Create role Manager"
    if (!name) {
      match = command.match(/(?:create|make|add).*role ([\w\s]+)/i);
      if (match) name = match[1].trim();
    }
    
    if (name) {
      console.log("Found create role:", name);
      return {
        action: "create_role",
        name: name,
        description: `${name} role`
      };
    }
  }
  
  // Assign permission - natural language patterns
  if ((lower.includes("give") || lower.includes("let") || lower.includes("allow")) && 
      (lower.includes("role") || lower.includes("permission"))) {
    
    let roleName = null;
    let permissionName = null;
    
    // "Give Editor permission to edit users"
    let match = command.match(/(?:give|let|allow).*?([\w\s]+?).*permission.*?(?:to )?([\w\s]+)/i);
    if (match) {
      roleName = match[1].trim();
      permissionName = match[2].trim();
    }
    
    // "Let the Editor role have permission to edit users"
    if (!roleName || !permissionName) {
      match = command.match(/(?:give|let|allow).*?(?:the )?([\w\s]+?).*?role.*?permission.*?(?:to )?([\w\s]+)/i);
      if (match) {
        roleName = match[1].trim();
        permissionName = match[2].trim();
      }
    }
    
    if (roleName && permissionName) {
      console.log("Found assign permission:", { roleName, permissionName });
      return {
        action: "assign_permission_to_role",
        roleName: roleName,
        permissionName: permissionName
      };
    }
  }
  
  console.log("No pattern matched for command:", command);
  return null;
}

// Gemini AI Primary Parser
async function parseWithGemini(command) {
  console.log("Processing with Gemini AI:", command);
  
  // Always try Gemini AI first for natural language understanding
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
    try {
      const prompt = `
You are an RBAC (Role-Based Access Control) assistant. Convert ANY natural language command related to permissions and roles into JSON.

You can understand commands like:
- "Make a new permission for viewing reports"
- "I want to create a role called Manager"
- "Let the Editor role have permission to edit users"
- "Remove permission from Admin role"
- "Add permission to role"
- "Create permission xyz"
- "New role abc"

ALWAYS return ONLY valid JSON with these actions:

1. For creating permissions:
{ "action": "create_permission", "name": "permission_name", "description": "description" }

2. For creating roles:
{ "action": "create_role", "name": "role_name", "description": "description" }

3. For giving permission to role:
{ "action": "assign_permission_to_role", "roleName": "role_name", "permissionName": "permission_name" }

4. For removing permission from role:
{ "action": "revoke_permission_from_role", "roleName": "role_name", "permissionName": "permission_name" }

Examples:
User: "Make a permission for publishing articles"
JSON: { "action": "create_permission", "name": "publish articles", "description": "Permission to publish articles" }

User: "I need a Manager role"
JSON: { "action": "create_role", "name": "Manager", "description": "Manager role with administrative access" }

User: "Give Editor the ability to edit users"
JSON: { "action": "assign_permission_to_role", "roleName": "Editor", "permissionName": "edit users" }

Now convert this user command:
"${command}"

Return ONLY the JSON object, no explanation:
`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      // Clean up response - remove markdown formatting if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log("Gemini response:", text);
      const parsed = JSON.parse(text);
      console.log("Parsed JSON:", parsed);
      
      return parsed;
      
    } catch (err) {
      console.error("Gemini AI error:", err.message);
      // If Gemini fails, try local parsing as backup
    }
  }
  
  // Fallback to local parsing only if Gemini completely fails
  console.log("Falling back to local parsing");
  const localResult = parseCommandLocally(command);
  if (!localResult) {
    throw new Error(`I couldn't understand your command: "${command}". Please try rephrasing it. Examples:\n- "Create a permission for managing users"\n- "Make a new role called Supervisor"\n- "Give the Editor role permission to edit content"`);
  }
  
  return localResult;
}

// Main Controller Function
exports.processCommand = async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: "command required" });

  try {
    console.log("Processing command:", command);
    const parsed = await parseWithGemini(command);
    console.log("Parsed command:", parsed);
    
    // Validate parsed command
    if (!parsed || !parsed.action) {
      return res.status(400).json({ 
        error: "Could not understand the command", 
        suggestion: "Try: 'Create a permission for managing users' or 'Make a Manager role'" 
      });
    }
    
    let response;

    switch (parsed.action) {
      case "create_permission":
        if (!parsed.name || parsed.name.trim() === '') {
          return res.status(400).json({ 
            error: "Permission name is required", 
            suggestion: "Try: 'Create a permission for viewing reports'" 
          });
        }
        response = await rbac.createPermission({ 
          name: parsed.name.trim(), 
          description: parsed.description || `Permission to ${parsed.name.trim()}` 
        });
        break;
        
      case "create_role":
        if (!parsed.name || parsed.name.trim() === '') {
          return res.status(400).json({ 
            error: "Role name is required", 
            suggestion: "Try: 'Create a Manager role'" 
          });
        }
        response = await rbac.createRole({ 
          name: parsed.name.trim(), 
          description: parsed.description || `${parsed.name.trim()} role` 
        });
        break;
        
      case "assign_permission_to_role":
        if (!parsed.roleName || parsed.roleName.trim() === '' || 
            !parsed.permissionName || parsed.permissionName.trim() === '') {
          return res.status(400).json({ 
            error: "Both role name and permission name are required", 
            suggestion: "Try: 'Give Editor permission to edit users'" 
          });
        }
        response = await rbac.assignPermissionToRole({
          roleName: parsed.roleName.trim(),
          permissionName: parsed.permissionName.trim(),
        });
        break;
        
      case "revoke_permission_from_role":
        if (!parsed.roleName || parsed.roleName.trim() === '' || 
            !parsed.permissionName || parsed.permissionName.trim() === '') {
          return res.status(400).json({ 
            error: "Both role name and permission name are required", 
            suggestion: "Try: 'Remove edit users permission from Editor role'" 
          });
        }
        response = await rbac.revokePermissionFromRole({
          roleName: parsed.roleName.trim(),
          permissionName: parsed.permissionName.trim(),
        });
        break;
        
      default:
        return res.status(400).json({ error: "Unknown action", parsed });
    }

    console.log("Command executed successfully:", response);
    res.json({ 
      success: true, 
      action: parsed.action, 
      command: command,
      result: response 
    });
    
  } catch (err) {
    console.error("NL Command Error:", err.message);
    res.status(500).json({ 
      error: "Failed to process command", 
      message: err.message,
      suggestion: "Try rephrasing your command or use simpler language" 
    });
  }
};