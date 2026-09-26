const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            enum: [
                "UPLOAD",
                "DOWNLOAD",
                "UPDATE",
                "DELETE",
                "SHARE",
                "VERSION_UPLOAD",
                "VERSION_RESTORE",
                "RESTORE"
            ],
            required: true
        },

        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null
        },

        details: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const ActivityLog = mongoose.model(
    "ActivityLog",
    activityLogSchema
);

module.exports = ActivityLog;