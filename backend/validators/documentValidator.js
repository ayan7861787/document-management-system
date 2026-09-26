const Joi = require("joi");

const updateDocumentSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .max(500)
        .optional(),

    category: Joi.string()
    .valid(
        "personal",
        "work",
        "academic",
        "financial",
        "other"
    )
    .optional()
});

module.exports = {
    updateDocumentSchema
};