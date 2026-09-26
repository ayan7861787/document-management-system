const ActivityLog = require("../models/ActivityLog");

const createActivityLog = async ({
    user,
    action,
    document = null,
    details = ""
}) => {
    try {
        await ActivityLog.create({
            user,
            action,
            document,
            details
        });
    } catch (error) {
        console.log("Activity log error:", error.message);
    }
};

module.exports = createActivityLog;