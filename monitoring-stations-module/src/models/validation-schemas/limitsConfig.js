const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createLimitsConfigSchema = Joi.object({});

const editLimitsConfigSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
});

module.exports = { createLimitsConfigSchema, editLimitsConfigSchema };
