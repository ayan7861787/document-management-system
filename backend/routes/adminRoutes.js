const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getAllDocuments,
    deleteUser,
    getDashboardStats
} = require("../controllers/adminController");

const router = express.Router();

router.get(
    "/test",
    protect,
    adminMiddleware,
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

router.get(
    "/users",
    protect,
    adminMiddleware,
    getAllUsers
);

router.get(
    "/documents",
    protect,
    adminMiddleware,
    getAllDocuments
);

router.delete(
    "/users/:id",
    protect,
    adminMiddleware,
    deleteUser
);
router.get(
    "/dashboard",
    protect,
    adminMiddleware,
    getDashboardStats
);

module.exports = router;