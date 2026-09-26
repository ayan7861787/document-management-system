const Document = require("../models/Document");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

const DocumentVersion = require("../models/DocumentVersion");
const createActivityLog = require("../utils/activityLogger");
const ActivityLog = require("../models/ActivityLog");

const uploadDocument = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const {
            title,
            description,
            category,
            isPublic
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const document = await Document.create({
            title,
            description,
            category,

            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,

            owner: req.user._id,

            isPublic: isPublic === "true"
        });

        await createActivityLog({
            user: req.user._id,
            action: "UPLOAD",
            document: document._id,
            details: `Uploaded ${document.fileName}`
        });

        res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            document
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getMyDocuments = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    try {
        const { search, category, fileType } = req.query;

        const filter = {
            isDeleted: { $ne: true },

            $or: [
                {
                    owner: req.user._id
                },
                {
                    "sharedWith.user": req.user._id
                }
            ]
        };

        // Search by title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by file type
        if (fileType) {
            filter.fileType = {
                $regex: fileType,
                $options: "i"
            };
        }

        const totalDocuments =
            await Document.countDocuments(filter);

        const documents = await Document.find(filter)
            .populate("owner", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalDocuments,
            totalPages: Math.ceil(
                totalDocuments / limit
            ),
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

const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        if (document.isDeleted) {
            return res.status(404).json({
                   success: false,
                   message: "Document is in trash"
            });
        }

        const userId = req.user._id.toString();

        // Owner always has download permission
        const isOwner =
            document.owner.toString() === userId;

        // Check shared user's permissions
        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canDownload =
            isOwner ||
            (sharedUser &&
                sharedUser.permissions.includes("download"));

        if (!canDownload) {
            return res.status(403).json({
                success: false,
                message: "You do not have download permission"
            });
        }

        const filePath = path.resolve(document.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server"
            });
        }

        await createActivityLog({
            user: req.user._id,
            action: "DOWNLOAD",
            document: document._id,
            details: `Downloaded ${document.fileName}`
        });

        res.download(
            filePath,
            document.fileName,
            (error) => {
                if (error) {
                    console.log("Download error:", error.message);
                }
            }
        );

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Check ownership
        if (
            document.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this document"
            });
        }

        // Check if already in trash
        if (document.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Document is already in trash"
            });
        }

        // Activity log
        await createActivityLog({
            user: req.user._id,
            action: "DELETE",
            document: document._id,
            details: `Moved ${document.fileName} to trash`
        });

        // Soft delete
        document.isDeleted = true;
        document.deletedAt = new Date();

        await document.save();

        res.status(200).json({
            success: true,
            message: "Document moved to trash successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const shareDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, permissions } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "User email is required"
            });
        }

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Only owner can share
        if (document.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can share this document"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Don't share with yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot share a document with yourself"
            });
        }

        const existingShare = document.sharedWith.find(
            (item) => item.user.toString() === user._id.toString()
        );

        if (existingShare) {
            existingShare.permissions =
                permissions || ["view"];
        } else {
            document.sharedWith.push({
                user: user._id,
                permissions: permissions || ["view"]
            });
        }

        await document.save();

        await createActivityLog({
    user: req.user._id,
    action: "SHARE",
    document: document._id,
    details: `Shared document with ${email}`
});

        

        res.status(200).json({
            success: true,
            message: "Document shared successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const userId = req.user._id.toString();

        // Owner can always edit
        const isOwner =
            document.owner.toString() === userId;

        // Check shared user permission
        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canEdit =
            isOwner ||
            (sharedUser &&
                sharedUser.permissions.includes("edit"));

        if (!canEdit) {
            return res.status(403).json({
                success: false,
                message: "You do not have edit permission"
            });
        }

        if (title !== undefined) {
            document.title = title;
        }

        if (description !== undefined) {
            document.description = description;
        }

        if (category !== undefined) {
            document.category = category;
        }

        await document.save();

        await createActivityLog({
            user: req.user._id,
            action: "UPDATE",
            document: document._id,
            details: `Updated document ${document.fileName}`
        });

        res.status(200).json({
            success: true,
            message: "Document updated successfully",
            document
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 

const uploadNewVersion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const userId = req.user._id.toString();

        // Check owner
        const isOwner =
            document.owner.toString() === userId;

        // Check shared user
        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canEdit =
            isOwner ||
            (sharedUser &&
                sharedUser.permissions.includes("edit"));

        if (!canEdit) {
            return res.status(403).json({
                success: false,
                message: "You do not have edit permission"
            });
        }

        // Find latest version
        const latestVersion = await DocumentVersion.findOne({
            document: document._id
        }).sort({ version: -1 });

        const nextVersion = latestVersion
            ? latestVersion.version + 1
            : 1;

        // Save current file as a version
        await DocumentVersion.create({
               document: document._id,
               version: nextVersion,
               fileName: req.file.originalname,
               filePath: req.file.path,
               fileType: req.file.mimetype,
               fileSize: req.file.size,
               uploadedBy: req.user._id
        });  

        // Update current document
        document.fileName = req.file.originalname;
        document.filePath = req.file.path;
        document.fileType = req.file.mimetype;
        document.fileSize = req.file.size;

        await document.save();


        await createActivityLog({
          user: req.user._id,
          action: "VERSION_UPLOAD",
          document: document._id,
          details: `Uploaded version ${nextVersion}`
       });

        res.status(200).json({
            success: true,
            message: "New document version uploaded successfully",
            version: nextVersion,
            document
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDocumentVersions = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const userId = req.user._id.toString();

        // Check owner
        const isOwner =
            document.owner.toString() === userId;

        // Check shared user
        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canView =
            isOwner ||
            (sharedUser &&
                (
                    sharedUser.permissions.includes("view") ||
                    sharedUser.permissions.includes("download") ||
                    sharedUser.permissions.includes("edit")
                ));

        if (!canView) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to view versions"
            });
        }

        const versions = await DocumentVersion.find({
            document: id
        })
        .populate("uploadedBy", "name email")
        .sort({ version: -1 });

        res.status(200).json({
            success: true,
            count: versions.length,
            versions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const restoreDocumentVersion = async (req, res) => {
    try {
        const { id, versionId } = req.params;

        // Find document
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const userId = req.user._id.toString();

        // Check owner
        const isOwner =
            document.owner.toString() === userId;

        // Check shared user
        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canEdit =
            isOwner ||
            (sharedUser &&
                sharedUser.permissions.includes("edit"));

        
        if (!canEdit) {
            return res.status(403).json({
                success: false,
                message: "You do not have edit permission"
            });
        }

        // Find requested version
        const oldVersion = await DocumentVersion.findById(
            versionId
        );

        if (!oldVersion) {
            return res.status(404).json({
                success: false,
                message: "Version not found"
            });
        }

        // Make sure version belongs to this document
        if (
            oldVersion.document.toString() !==
            document._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "This version does not belong to this document"
            });
        }

        // Save current file as a new version
        const latestVersion = await DocumentVersion.findOne({
            document: document._id
        }).sort({ version: -1 });

        const nextVersion = latestVersion
            ? latestVersion.version + 1
            : 1;

        await DocumentVersion.create({
            document: document._id,
            version: nextVersion,
            fileName: document.fileName,
            filePath: document.filePath,
            fileType: document.fileType,
            fileSize: document.fileSize,
            uploadedBy: req.user._id
        });

        // Restore old version
        document.fileName = oldVersion.fileName;
        document.filePath = oldVersion.filePath;
        document.fileType = oldVersion.fileType;
        document.fileSize = oldVersion.fileSize;

        await document.save();
         
        await createActivityLog({
            user: req.user._id,
            action: "VERSION_RESTORE",
            document: document._id,
            details: `Restored version ${oldVersion.version}`
        });

        res.status(200).json({
            success: true,
            message: "Document version restored successfully",
            document
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDocumentActivityLogs = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const userId = req.user._id.toString();

        const isOwner =
            document.owner.toString() === userId;

        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canView =
            isOwner ||
            (sharedUser &&
                (
                    sharedUser.permissions.includes("view") ||
                    sharedUser.permissions.includes("download") ||
                    sharedUser.permissions.includes("edit")
                ));

        if (!canView) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to view activity logs"
            });
        }

        const logs = await ActivityLog.find({
            document: id
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPublicDocuments = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const filter = {
            isPublic: true,
            isDeleted: { $ne: true }
        };

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            filter.category = category;
        }

        const totalDocuments = await Document.countDocuments(filter);

        const documents = await Document.find(filter)
            .populate("owner", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            page: pageNumber,
            limit: limitNumber,
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / limitNumber),
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

const getTrashDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            owner: req.user._id,
            isDeleted: true
        })
        .populate("owner", "name email")
        .sort({ deletedAt: -1 });

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

const restoreDeletedDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Check ownership
        if (
            document.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to restore this document"
            });
        }

        // Check if document is actually in trash
        if (!document.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Document is not in trash"
            });
        }

        // Restore document
        document.isDeleted = false;
        document.deletedAt = null;

        await document.save();

        // Activity log
        await createActivityLog({
            user: req.user._id,
            action: "RESTORE",
            document: document._id,
            details: `Restored ${document.fileName} from trash`
        });

        res.status(200).json({
            success: true,
            message: "Document restored successfully",
            document
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const permanentlyDeleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Check ownership
        if (
            document.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to permanently delete this document"
            });
        }

        // Must be in trash
        if (!document.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Document must be in trash first"
            });
        }

        // Delete physical file
        const filePath = path.resolve(document.filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete database record
        await Document.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Document permanently deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id)
            .populate("owner", "name email role");

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Don't allow access to deleted documents
        if (document.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Document is in trash"
            });
        }

        const userId = req.user._id.toString();

        // Owner
        const isOwner =
            document.owner._id.toString() === userId;

        // Shared user
        const sharedUser = document.sharedWith.find(
            (item) => item.user.toString() === userId
        );

        const canView =
            isOwner ||
            (sharedUser &&
                (
                    sharedUser.permissions.includes("view") ||
                    sharedUser.permissions.includes("download") ||
                    sharedUser.permissions.includes("edit")
                ));

        if (!canView) {
            return res.status(403).json({
                success: false,
                message: "You do not have view permission"
            });
        }

        res.status(200).json({
            success: true,
            document
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    downloadDocument,
    deleteDocument,
    shareDocument,
    updateDocument,
    uploadNewVersion,
    getDocumentVersions,
    restoreDocumentVersion,
    getDocumentActivityLogs,
    getPublicDocuments,
    getTrashDocuments,
    restoreDeletedDocument,
    permanentlyDeleteDocument,
    getDocumentById

};