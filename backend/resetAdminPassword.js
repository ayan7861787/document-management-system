require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@gmail.com";
        const newPassword = "Admin@123";

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("Admin user not found");
            process.exit(1);
        }

        console.log("Admin password reset successfully");
        console.log("Email:", email);
        console.log("Password:", newPassword);

        process.exit(0);

    } catch (error) {
        console.log("Error:", error.message);
        process.exit(1);
    }
};

resetAdminPassword();