const User = require("../models/User.model");

// Helper to get current user with role
async function getCurrentUser(req) {
  const userId = req.userId;
  if (!userId) return null;
  try {
    const user = await User.findById(userId);
    return user || null;
  } catch (_) {
    return null;
  }
}

// Generic role guard: requires one of the roles
function requireRole(roles = []) {
  return async (req, res, next) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }
    next();
  };
}

// Convenience admin-only guard
const requireAdmin = requireRole(["admin"]);

// Allow self update or admin
async function requireSelfOrAdminUpdate(req, res, next) {
  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }
  const targetId = req.params.id;
  const isSelf = String(targetId) === String(user._id);
  const isAdmin = user.role === "admin";
  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: "No autorizado para actualizar este usuario" });
  }
  next();
}

// Prevent role changes unless current user is admin
async function forbidRoleChangeIfNotAdmin(req, res, next) {
  const intendsRoleChange = Object.prototype.hasOwnProperty.call(req.body, "role");
  if (!intendsRoleChange) return next();

  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Solo un administrador puede cambiar roles" });
  }
  next();
}

module.exports = {
  requireRole,
  requireAdmin,
  requireSelfOrAdminUpdate,
  forbidRoleChangeIfNotAdmin,
};