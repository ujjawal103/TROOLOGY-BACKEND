const express = require("express");
const router = express.Router();

const { body, param } = require("express-validator");

const projectController = require("../controllers/project.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const upload = require("../cloudinary/multer.config");



// project created by admin only 
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    upload.array("attachments", 3),
    [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters"),

        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required")
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters"),

        body("startDate")
            .notEmpty()
            .withMessage("Start date is required")
            .isISO8601()
            .withMessage("Invalid start date"),

        body("endDate")
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.startDate)) {
                    throw new Error(
                        "End date must be after start date"
                    );
                }
                return true;
            }),

        body("status")
            .optional()
            .isIn([
                "Pending",
                "In-Progress",
                "Completed"
            ])
            .withMessage("Invalid status"),

        body("assignedUsers")
            .optional()
            .isArray()
            .withMessage("Assigned users must be an array"),

        body("assignedUsers.*")
            .optional()                // validates all id's also
            .isMongoId()
            .withMessage("Invalid user id")    
    ],
    projectController.createProject
);


//in controller we will decide if admin --- then show all projects , otherwise only assigned projects.
router.get(
    "/",
    authMiddleware,
    projectController.getProjects
);



// same here decided in controller
router.get(
    "/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid project id")
    ],
    projectController.getProjectById
);



//only admin will update the project
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    upload.array("attachments", 3),
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid project id"),

        body("title")
            .optional()
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters"),

        body("description")
            .optional()
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters"),

        body("startDate")
            .notEmpty()
            .withMessage("Start date is required")
            .isISO8601()
            .withMessage("Invalid start date"),

        body("endDate")
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.startDate)) {
                    throw new Error(
                        "End date must be after start date"
                    );
                }
                return true;
            }),    

        body("status")
            .optional()
            .isIn([
                "Pending",
                "In-Progress",
                "Completed"
            ])
            .withMessage("Invalid status"),

        body("assignedUsers")
            .optional()
            .isArray()
            .withMessage("Assigned users must be an array"),

        body("assignedUsers.*")
            .optional()
            .isMongoId()
            .withMessage("Invalid user id")    
    ],
    projectController.updateProject
);




// only admin will delete the project.
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid project id")
    ],
    projectController.deleteProject
);




// user can change the status of project only [assigned user]
router.patch(
    "/status/:id",
    authMiddleware,
    roleMiddleware("user"),
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid project id"),

        body("status")
            .notEmpty()
            .withMessage("Status is required")
            .isIn([
                "Pending",
                "In-Progress",
                "Completed"
            ])
            .withMessage("Invalid status")
    ],
    projectController.updateProjectStatus
);


module.exports = router;