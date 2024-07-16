const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createRoleSchema = Joi.object({
  name: Joi.string().required().min(4).max(15).messages({
    "*": "El campo nombre es requerido y debe tener entre 4 y 15 caracteres",
  }),
});

const editRoleSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().required().min(4).max(15).messages({
    "*": "El campo nombre es requerido y debe tener entre 4 y 15 caracteres",
  }),
});

module.exports = { createRoleSchema, editRoleSchema };
