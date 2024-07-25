const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createSystemAlertSchema = Joi.object({
  titulo: Joi.string().required().messages({
    "*": "El campo 'titulo' es requerido y debe ser una cadena",
  }),
  tipo: Joi.string().valid('FallaNodo', 'Parametros no saludables').required().messages({
    "*": "El campo 'tipo' es requerido y debe ser 'FallaNodo' o 'Parametros no saludables'",
  }),
  severidad: Joi.string().valid('Alta', 'Media', 'Baja').required().messages({
    "*": "El campo 'severidad' es requerido y debe ser 'Alta', 'Media' o 'Baja'",
  }),
  descripcion: Joi.string().required().messages({
    "*": "El campo 'descripcion' es requerido y debe ser una cadena",
  }),
  detalle: Joi.object().required().messages({
    "*": "El campo 'detalle' es requerido y debe ser un objeto",
  }),
  fecha: Joi.date().default(Date.now).messages({
    "*": "El campo 'fecha' debe ser una fecha válida",
  }),
  resuelta: Joi.boolean().default(false).messages({
    "*": "El campo 'resuelta' debe ser un booleano",
  }),
  accionesAplicadas: Joi.string().allow('').optional().messages({
    "*": "El campo 'accionesAplicadas' debe ser una cadena",
  }),
});

const editSystemAlertSchema = Joi.object({
  id: Joi.string().required().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  titulo: Joi.string().optional().messages({
    "*": "El campo 'titulo' debe ser una cadena",
  }),
  tipo: Joi.string().valid('FallaNodo', 'Parametros no saludables').optional().messages({
    "*": "El campo 'tipo' debe ser 'FallaNodo' o 'Parametros no saludables'",
  }),
  severidad: Joi.string().valid('Alta', 'Media', 'Baja').optional().messages({
    "*": "El campo 'severidad' debe ser 'Alta', 'Media' o 'Baja'",
  }),
  descripcion: Joi.string().optional().messages({
    "*": "El campo 'descripcion' debe ser una cadena",
  }),
  detalle: Joi.object().optional().messages({
    "*": "El campo 'detalle' debe ser un objeto",
  }),
  fecha: Joi.date().optional().messages({
    "*": "El campo 'fecha' debe ser una fecha válida",
  }),
  resuelta: Joi.boolean().optional().messages({
    "*": "El campo 'resuelta' debe ser un booleano",
  }),
  accionesAplicadas: Joi.string().allow('').optional().messages({
    "*": "El campo 'accionesAplicadas' debe ser una cadena",
  }),
});

module.exports = { createSystemAlertSchema, editSystemAlertSchema };