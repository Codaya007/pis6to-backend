const Joi = require("joi");

const createClimateDataSchema = Joi.object({
  temp: Joi.number().required().messages({
    "*": "El campo temperatura 'temp' es requerido y debe ser un número",
  }),
  hum: Joi.number().required().messages({
    "*": "El campo humedad 'hum' es requerido y debe ser un número",
  }),
  co2: Joi.number().required().messages({
    "*": "El campo dióxido de carbono 'co2' es requerido y debe ser un número",
  }),
  // OPCIONALES
  press: Joi.number().optional().messages({
    "*": "El campo presión atmosférica 'press' es requerido y debe ser un número",
  }),
  heat: Joi.number().optional().messages({
    "*": "El campo calor 'heat' es requerido y debe ser un número",
  }),
  // Relaciones
  nodeCode: Joi.string().required().messages({
    "*": "El campo código del nodo 'nodeCode' es requerido",
  }),
});

module.exports = { createClimateDataSchema };
