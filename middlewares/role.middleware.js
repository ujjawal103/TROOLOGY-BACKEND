const roleMiddleware = (...roles) => {          // roles = ["admin", "user"]  or roles = ["admin"]   or roles=["user"]

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};

module.exports = roleMiddleware;



// IMP -> in the routes we will decide who can access with arguments.  [we didn't need to create seperate functions of adminRole , userRole {managerRole , empRole in future}]