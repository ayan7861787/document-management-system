const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    updateDocumentSchema
} = require("../validators/documentValidator");

const {
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

} = require("../controllers/documentController");

const router = express.Router();

router.post(
    "/upload",
    protect,
    upload.single("document"),
    uploadDocument
);

router.get(
    "/public",
    protect,
    getPublicDocuments
);

router.get(
    "/",
    protect,
    getMyDocuments
);

router.get(
    "/download/:id",
    protect,
    downloadDocument
);

router.delete(
    "/:id",
    protect,
    deleteDocument
);

router.post(
    "/share/:id",
    protect,
    shareDocument
);

router.put(
    "/:id",
    protect,
    validate(updateDocumentSchema),
    updateDocument
);

router.put(
    "/:id/version",
    protect,
    upload.single("document"),
    uploadNewVersion
);

router.get(
    "/:id/versions",
    protect,
    getDocumentVersions
);

router.put(
    "/:id/versions/:versionId/restore",
    protect,
    restoreDocumentVersion
);

router.get(
    "/:id/activity",
    protect,
    getDocumentActivityLogs
);

router.get(
    "/trash",
    protect,
    getTrashDocuments
);

router.put(
    "/trash/:id/restore",
    protect,
    restoreDeletedDocument
);

router.get(
    "/:id",
    protect,
    getDocumentById
);


router.delete(
    "/trash/:id/permanent",
    protect,
    permanentlyDeleteDocument
);


module.exports = router;