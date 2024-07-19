const Joi = require("joi");
const { ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME } = require("../../constants");
const { isValidObjectId } = require("mongoose");

const createNodeSchema = Joi.object({
  name: Joi.string().min(3).max(25).required().messages({
    "*": "El campo 'name' es requerido y debe ser una cadena entre 3 y 25 caracteres",
  }),
  location: Joi.string().required().messages({
    "*": "El campo 'location' es requerido y debe ser una cadena",
  }),
  code: Joi.string().required().messages({
    "*": "El campo 'code' es requerido y debe ser una cadena única",
  }),
  photos: Joi.array().items(Joi.string()).optional().messages({
    "*": "El campo 'photos' debe ser una lista de cadenas",
  }),
  status: Joi.string()
    .valid(ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME)
    .default(ACTIVE_STATUS_NAME)
    .messages({
      "*": `El campo 'status' debe ser '${ACTIVE_STATUS_NAME}' o '${INACTIVE_STATUS_NAME}'`,
    }),
  monitoringStation: Joi.string().required().messages({
    "*": "El campo 'monitoringStation' debe ser un ObjectId válido",
  }),
});

const editNodeSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().min(3).max(25).optional().messages({
    "*": "El campo 'name' debe ser una cadena entre 3 y 25 caracteres",
  }),
  location: Joi.string().optional().messages({
    "*": "El campo 'location' debe ser una cadena",
  }),
  code: Joi.string().optional().messages({
    "*": "El campo 'code' debe ser una cadena única",
  }),
  photos: Joi.array().items(Joi.string()).optional().messages({
    "*": "El campo 'photos' debe ser una lista de cadenas",
  }),
  status: Joi.string()
    .valid(ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME)
    .optional()
    .messages({
      "*": `El campo 'status' debe ser '${ACTIVE_STATUS_NAME}' o '${INACTIVE_STATUS_NAME}'`,
    }),
  monitoringStation: Joi.string().optional().messages({
    "*": "El campo 'monitoringStation' debe ser un ObjectId válido",
  }),
});

module.exports = { createNodeSchema, editNodeSchema };
