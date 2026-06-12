const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");


router.get(
    "/stats",
    authMiddleware,
    roleMiddleware("admin"),
    dashboardController.getDashboardStats
);

module.exports = router;