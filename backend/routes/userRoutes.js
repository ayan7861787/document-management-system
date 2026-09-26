const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json({
        success: true,
        message: "Profile accessed",
        user: req.user
    });
});

router.get(
    "/admin",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

router.get(
    "/manager",
    protect,
    authorize("admin", "manager"),
    (req, res) => {
        res.json({
            success: true,
            message: "Manager area accessed"
        });
    }
);

module.exports = router;