const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {

    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];          // Bearer tokenn

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;