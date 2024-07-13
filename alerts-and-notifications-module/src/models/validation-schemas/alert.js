const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createAlertSchema = Joi.object({});

const editAlertSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
});

module.exports = { createAlertSchema, editAlertSchema };
