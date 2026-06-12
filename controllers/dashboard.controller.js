const User = require("../models/user.model");
const Project = require("../models/project.model");

module.exports.getDashboardStats = async (
    req,
    res
) => {
    try {

        const totalUsers =
            await User.countDocuments();

        const totalProjects =
            await Project.countDocuments();

        const pendingProjects =
            await Project.countDocuments({
                status: "Pending"
            });

        const inProgressProjects =
            await Project.countDocuments({
                status: "In-Progress"
            });

        const completedProjects =
            await Project.countDocuments({
                status: "Completed"
            });

        const today = new Date();

        const nextSevenDays = new Date();

        nextSevenDays.setDate(
            today.getDate() + 7
        );

        const endingSoonProjects =
            await Project.countDocuments({
                endDate: {
                    $gte: today,
                    $lte: nextSevenDays
                }
            });

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProjects,
                pendingProjects,
                inProgressProjects,
                completedProjects,
                endingSoonProjects
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};