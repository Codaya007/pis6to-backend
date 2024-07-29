const Joi = require("joi");

const createSystemActivitySchema = Joi.object({
  type: Joi.string().required().messages({
    "*": "El campo 'type' es requerido y debe ser una cadena",
  }),
  model: Joi.string().optional().messages({
    "*": "El campo 'model' es requerido y debe ser una cadena",
  }),
  route: Joi.string().required().messages({
    "*": "El campo 'route' es requerido y debe ser una cadena",
  }),
  body: Joi.object().required().messages({
    "*": "El campo 'body' es requerido y debe ser un JSON",
  }),
  user: Joi.string().messages({
    "*": "Usuario requerido",
  }),
});

module.exports = { createSystemActivitySchema };
