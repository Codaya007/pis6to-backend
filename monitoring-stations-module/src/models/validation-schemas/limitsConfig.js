const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const parameterValueSchema = Joi.object({
  _id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  __v: Joi.string().optional().messages({
    "*": "Id no válido",
  }),
  displayName: Joi.string().required().messages({
    "*": "El campo 'displayName' es requerido y debe ser una cadena",
  }),
  values: Joi.object({
    max: Joi.number().required().messages({
      "*": "El campo 'max' es requerido y debe ser un número",
    }),
    min: Joi.number().required().messages({
      "*": "El campo 'min' es requerido y debe ser un número",
    }),
  })
    .required()
    .messages({
      "*": "El campo 'values' es requerido y debe contener los campos 'max' y 'min'",
    }),
});

const createLimitsConfigSchema = Joi.object({
  temp: parameterValueSchema.required().messages({
    "*": "El campo 'temp' es requerido y debe seguir la estructura definida",
  }),
  press: parameterValueSchema.required().messages({
    "*": "El campo 'press' es requerido y debe seguir la estructura definida",
  }),
  hum: parameterValueSchema.required().messages({
    "*": "El campo 'hum' es requerido y debe seguir la estructura definida",
  }),
  co2: parameterValueSchema.required().messages({
    "*": "El campo 'co2' es requerido y debe seguir la estructura definida",
  }),
  heat: parameterValueSchema.required().messages({
    "*": "El campo 'heat' es requerido y debe seguir la estructura definida",
  }),
});

const editLimitsConfigSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  temp: parameterValueSchema.optional().messages({
    "*": "El campo 'temp' debe seguir la estructura definida",
  }),
  press: parameterValueSchema.optional().messages({
    "*": "El campo 'press' debe seguir la estructura definida",
  }),
  hum: parameterValueSchema.optional().messages({
    "*": "El campo 'hum' debe seguir la estructura definida",
  }),
  co2: parameterValueSchema.optional().messages({
    "*": "El campo 'co2' debe seguir la estructura definida",
  }),
  heat: parameterValueSchema.optional().messages({
    "*": "El campo 'heat' debe seguir la estructura definida",
  }),
});

module.exports = { createLimitsConfigSchema, editLimitsConfigSchema };
