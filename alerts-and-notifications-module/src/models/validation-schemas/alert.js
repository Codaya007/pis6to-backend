const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
// const {
//   WARN_TYPE_ALERT,
//   ERROR_TYPE_ALERT,
//   SUCCESS_TYPE_ALERT,
//   INFO_TYPE_ALERT,
// } = require("../../constants");

const createAlertSchema = Joi.object({
  title: Joi.string().required().messages({
    "*": "El campo 'titulo' es requerido y debe ser un String",
  }),
  description: Joi.string().required().messages({
    "*": "El campo 'decripcion' es requerido y debe ser un String",
  }),
  url: Joi.string().optional().messages({
    "*": "El campo 'url' es opcional y debe ser un String",
  }),
  type: Joi.string()
    .valid("FallaNodo", "Parametros no saludables")
    .required()
    .messages({
      "*": "El campo 'tipo' es requerido y debe ser 'FallaNodo' o 'Parametros no saludables'",
    }),
  severity: Joi.string().valid("Alta", "Media", "Baja").required().messages({
    "*": "El campo 'severidad' es requerido y debe ser 'Alta', 'Media' o 'Baja'",
  }),
  // type: Joi.string()
  //   .valid(
  //     ERROR_TYPE_ALERT,
  //     WARN_TYPE_ALERT,
  //     SUCCESS_TYPE_ALERT,
  //     INFO_TYPE_ALERT
  //   )
  //   .required()
  //   .messages({
  //     "*": `El campo 'Tipo' es requerido debe ser '${ERROR_TYPE_ALERT}', ${WARN_TYPE_ALERT}, ${SUCCESS_TYPE_ALERT},  o '${INFO_TYPE_ALERT}'`,
  //   }),
  node: Joi.string().required().custom(isValidObjectId).messages({
    "*": "El campo 'node' es requerido y debe ser de tipo ObjectId",
  }),
  resolved: Joi.boolean().optional().messages({
    "*": "El campo 'resolvido' es opcional y debe ser un Boolean",
  }),
  resolvedBy: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "El campo 'resuelto por' no requerido y debe ser de tipo ObjectId",
  }),
  emitSound: Joi.boolean().optional().messages({
    "*": "El campo 'emitir un sonido' es opcional y debe ser un Boolean",
  }),
});

const muteAlert = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  emitSound: Joi.boolean().required().messages({
    "*": "El campo 'emitir un sonido' es requerido y debe ser un Boolean",
  }),
});

const resolveAlert = Joi.object({
  id: Joi.string().required().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  resolved: Joi.boolean().required().messages({
    "*": "El campo 'resolvido' es requrido y debe ser un Boolean",
  }),
  resolvedBy: Joi.string().required().custom(isValidObjectId).messages({
    "*": "El campo 'resuelto por' es requerido y debe ser de tipo ObjectId",
  }),
  appliedActions: Joi.string().messages({
    "*": "El campo 'resolvedComment' debe ser un string y es requerido",
  }),
});

module.exports = { createAlertSchema, muteAlert, resolveAlert };
