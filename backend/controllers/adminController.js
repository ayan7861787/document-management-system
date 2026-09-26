const User = require("../models/User");
const Document = require("../models/Document");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: documents.length,
            documents
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting their own account
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        // Delete user's documents
        await Document.deleteMany({
            owner: id
        });

        // Delete user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User and their documents deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalAdmins = await User.countDocuments({
            role: "admin"
        });

        const totalDocuments = await Document.countDocuments();

        const documentsByCategory = await Document.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        const recentDocuments = await Document.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalDocuments,
                documentsByCategory,
                recentDocuments
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getAllDocuments,
    deleteUser,
    getDashboardStats
};