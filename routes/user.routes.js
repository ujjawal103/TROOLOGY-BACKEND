const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");




// create a user (only admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters"),

    body("email")
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .optional()
      .isIn(["admin", "user"])
      .withMessage("Role must be admin or user"),
  ],
  userController.createUser
);



//all users (admin)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getAllUsers
);


// get one user by id (admin prevented)
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid user id"),
  ],
  userController.getUserById
);



// update amy user by admin email also
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid user id"),

    body("firstName")
      .optional()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters"),

    body("lastName")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters"),

    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid email"),
  ],
  userController.updateUser
);



// delete a user (admin)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid user id"),
  ],
  userController.deleteUser
);


// change the user role by admin
router.patch(
  "/role/:id",
  authMiddleware,
  roleMiddleware("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Invalid user id"),

    body("role")
      .isIn(["admin", "user"])
      .withMessage("Role must be admin or user"),
  ],
  userController.changeRole
);



// user can update his profile also (not email)
router.put(
  "/profile/update",
  authMiddleware,
  [
    body("firstName")
      .optional()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters"),

    body("lastName")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters"),
  ],
  userController.updateProfile
);


module.exports = router;