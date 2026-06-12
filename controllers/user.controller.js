const { validationResult } = require("express-validator");
const User = require("../models/user.model");

module.exports.createUser = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            firstName,
            lastName,
            email,
            password,
            role
        } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // hash password
        const hashedPassword = await User.hashedPassword(password);

        
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
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



module.exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


module.exports.getUserById = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// admin update user details
module.exports.updateUser = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (req.body.email) {          

            const existingUser = await User.findOne({
                email: req.body.email
            });

            if (
                existingUser &&
                existingUser._id.toString() !== id       // we will check only for others user not itself [ when email not changed]
            ) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


module.exports.deleteUser = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


module.exports.changeRole = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            user
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// user profile updation
module.exports.updateProfile = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};