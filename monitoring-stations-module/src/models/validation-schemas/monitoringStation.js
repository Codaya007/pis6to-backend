const Joi = require("joi");
const { ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME } = require("../../constants");
const { isValidObjectId } = require("mongoose");

const monitoringStationNomenclatureSchema = Joi.object({
  campus: Joi.string().required().messages({
    "*": "El campo 'campus' es requerido y debe ser una cadena",
  }),
  bloque: Joi.number().integer().required().messages({
    "*": "El campo 'bloque' es requerido y debe ser un número",
  }),
  piso: Joi.number().integer().required().messages({
    "*": "El campo 'piso' es requerido y debe ser un número",
  }),
  ambiente: Joi.number().integer().required().messages({
    "*": "El campo 'ambiente' es requerido y debe ser un número",
  }),
  subAmbiente: Joi.number().integer().optional().allow(null).messages({
    "*": "El campo 'subAmbiente' debe ser un número o nulo",
  }),
});

const createMonitoringStationSchema = Joi.object({
  name: Joi.string().required().messages({
    "*": "El campo 'nombre' es requerido y debe ser una cadena",
  }),
  address: Joi.string().required().messages({
    "*": "El campo 'dirección' es requerido y debe ser una cadena",
  }),
  reference: Joi.string().required().messages({
    "*": "El campo 'referencia' es requerido y debe ser una cadena",
  }),
  photos: Joi.array().items(Joi.string()).optional().allow(null).messages({
    "*": "El campo 'fotos' debe ser una lista de cadenas o nulo",
  }),
  coordinate: Joi.array()
    .items(Joi.number().precision(10))
    .length(2)
    .optional()
    .allow(null)
    .messages({
      "*": "El campo 'coordenadas' debe ser una lista de dos números o nulo [latitud, longitud]",
    }),
  status: Joi.string()
    .valid(ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME)
    .default(ACTIVE_STATUS_NAME)
    .messages({
      "*": `El campo 'estado' debe ser '${ACTIVE_STATUS_NAME}' o '${INACTIVE_STATUS_NAME}'`,
    }),
  nomenclature: monitoringStationNomenclatureSchema.required().messages({
    "*": "El campo 'nomenclatura' es requerido y debe seguir la estructura definida",
  }),
});

const editMonitoringStationSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().optional().messages({
    "*": "El campo 'nombre' debe ser una cadena",
  }),
  address: Joi.string().optional().messages({
    "*": "El campo 'dirección' debe ser una cadena",
  }),
  reference: Joi.string().optional().messages({
    "*": "El campo 'referencia' debe ser una cadena",
  }),
  photos: Joi.array().items(Joi.string()).optional().allow(null).messages({
    "*": "El campo 'fotos' debe ser una lista de cadenas o nulo",
  }),
  coordinate: Joi.array()
    .items(Joi.number().precision(10))
    .length(2)
    .optional()
    .allow(null)
    .messages({
      "*": "El campo 'coordenadas' debe ser una lista de dos números o nulo",
    }),
  status: Joi.string()
    .valid(ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME)
    .optional()
    .messages({
      "*": `El campo 'estado' debe ser '${ACTIVE_STATUS_NAME}' o '${INACTIVE_STATUS_NAME}'`,
    }),
  nomenclature: monitoringStationNomenclatureSchema.optional().messages({
    "*": "El campo 'nomenclatura' debe seguir la estructura definida",
  }),
});

module.exports = { createMonitoringStationSchema, editMonitoringStationSchema };
