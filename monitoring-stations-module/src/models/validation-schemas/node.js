const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createNodeSchema = Joi.object({});

const editNodeSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
});

module.exports = { createNodeSchema, editNodeSchema };
