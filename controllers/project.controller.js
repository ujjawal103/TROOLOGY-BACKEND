const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Project = require("../models/project.model")
const { cloudUpload , cloudDelete } = require("../utils/cloudinary.utils");

module.exports.createProject = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { title, description, startDate, endDate, status, assignedUsers } = req.body;

        const attachments = [];

        // upload files to cloudinary
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudUpload(
                    file.buffer,
                    "projects"
                );

                attachments.push({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        }

        const project = await Project.create({
            title,
            description,
            startDate,
            endDate,
            status: status || "Pending",
            assignedUsers,
            attachments,
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports.getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === "admin") {
            projects = await Project.find()
                .populate(
                    "assignedUsers",
                    "firstName lastName email role"
                )
                .populate(
                    "createdBy",
                    "firstName lastName email"
                );
        } else {
            projects = await Project.find({
                assignedUsers: req.user._id           // user can see ony projects that are assigned to him
            })
                .populate(
                    "assignedUsers",
                    "firstName lastName email role"
                )
                .populate(
                    "createdBy",
                    "firstName lastName email"
                );
        }

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports.getProjectById = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const project = await Project.findById(
            req?.params?.id
        )
        .populate(
            "assignedUsers",
            "firstName lastName email role"
        )
        .populate(
            "createdBy",
            "firstName lastName email"
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // user can only view assigned projects
        if (
            req.user.role === "user" &&
            !project.assignedUsers.some( (user) => user._id.toString() === req.user._id.toString() //user id not in assignedusers
            )
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        return res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


module.exports.updateProject = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }
            if (req.files?.length > 0) {

            const existingAttachments = project.attachments.length;

            const newAttachments = req.files.length;

            if ( existingAttachments + newAttachments > 3 ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Maximum 3 attachments allowed per project"
                });
            }

            for (const file of req.files) {
                const result = await cloudUpload(
                    file.buffer,
                    "projects"
                );

                project.attachments.push({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        }

        if (req.body.title)
            project.title = req.body.title;

        if (req.body.description)
            project.description =
                req.body.description;

        if (req.body.startDate)
            project.startDate =
                req.body.startDate;

        if (req.body.endDate)
            project.endDate =
                req.body.endDate;

        if (req.body.status)
            project.status =
                req.body.status;

        if (req.body.assignedUsers)
            project.assignedUsers =
                req.body.assignedUsers;

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports.deleteProject = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // delete all attachments from cloudinary also
        for (const attachment of project.attachments) {

            await cloudDelete(
                attachment.publicId
            );
        }

        await Project.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};



// user can change status of projects assigne to him only
module.exports.updateProjectStatus = async ( req, res ) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const isAssigned =
            project.assignedUsers.some(
                (userId) =>
                    userId.toString() ===
                    req.user._id.toString()
            );

        if (!isAssigned) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not assigned to this project"
            });
        }

        project.status = req.body.status;

        await project.save();

        return res.status(200).json({
            success: true,
            message:
                "Project status updated successfully",
            project
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};



