import jwt from "jsonwebtoken";
const userPermission = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    // SuperAdmin bypasses all checks
    if (user.role === "SuperAdmin") {
      return next();
    }

    // If user has limited access via rolesSections
    if (user.rolesSections && Array.isArray(user.rolesSections)) {
      // check if at least one of required roles exists in rolesSections
      const hasSectionPermission = roles.some((role) =>
        user.rolesSections.includes(role)
      );

      if (hasSectionPermission) {
        return next();
      }
    }

    // Otherwise, deny access
    return res.status(403).json({
      status: "Failed",
      message: "You do not have permission to access this route",
    });
  };
};

module.exports = {
  userPermission,
};
