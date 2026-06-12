const express = require("express");
const router = express.Router();
const { body , param } = require("express-validator");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


// user or admin login
router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ],
    authController.login
);


// current logged in user
router.get(
    "/me",
    authMiddleware,
    authController.getCurrentUser
);


// logout any one
router.post(
    "/logout",
    authMiddleware,
    authController.logout
);


module.exports = router;