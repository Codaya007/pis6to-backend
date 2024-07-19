const Joi = require("joi");
const {
  ACTIVE_STATUS_NAME,
  INACTIVE_STATUS_NAME,
  ALLOWED_SENSORS,
} = require("../../constants");
const { isValidObjectId } = require("mongoose");

const createSensorSchema = Joi.object({
  type: Joi.string()
    .valid(...ALLOWED_SENSORS)
    .required()
    .messages({
      "*": "El campo 'type' es requerido y debe ser uno de los valores permitidos",
    }),
  node: Joi.string().optional().messages({
    "*": "El campo 'node' debe ser un ObjectId válido",
  }),
  code: Joi.string().required().messages({
    "*": "El campo 'code' es requerido y debe ser una cadena única",
  }),
  status: Joi.string()
    .valid(ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME)
    .default(ACTIVE_STATUS_NAME)
    .messages({
      "*": `El campo 'status' debe ser '${ACTIVE_STATUS_NAME}' o '${INACTIVE_STATUS_NAME}'`,
    }),
});

const editSensorSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  type: Joi.string()
    .valid(...ALLOWED_SENSORS)
    .optional()
    .messages({
      "*": "El campo 'type' debe ser uno de los valores permitidos",
    }),
  node: Joi.string().optional().messages({
    "*": "El campo 'node' debe ser un ObjectId válido",
  }),
  code: Joi.string().optional().messages({
    "*": "El campo 'code' debe ser una cadena única",
  }),
  status: Joi.string()
    .valid(ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME)
    .optional()
    .messages({
      "*": `El campo 'status' debe ser '${ACTIVE_STATUS_NAME}' o '${INACTIVE_STATUS_NAME}'`,
    }),
});

module.exports = { createSensorSchema, editSensorSchema };
