const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createSensorSchema = Joi.object({});

const editSensorSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
});

module.exports = { createSensorSchema, editSensorSchema };
