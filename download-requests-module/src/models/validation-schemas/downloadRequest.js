const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const {
  ACCEPTED_DOWNLOAD_REQUEST_STATUS,
  DENNY_DOWNLOAD_REQUEST_STATUS,
} = require("../../constants");

const createDownloadRequestSchema = Joi.object({
  researcher: Joi.string().required().custom(isValidObjectId).messages({
    "*": "Debe enviar su id de investigador",
  }),
  comment: Joi.string()
    .required()
    .messages({ "*": "Se debe ingresar un comentario" }),
  downloadType: Joi.string()
    .required()
    .messages({ "*": "Se debe ingresar el tipo de descarga" }),
  filterDate: Joi.object({
    from: Joi.date().iso().allow(null),
    to: Joi.date().iso().allow(null),
  }).messages({ "*": "Fechas no validas, son requeridas" }),
});

const updateDownloadRequestSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  status: Joi.string()
    .valid(DENNY_DOWNLOAD_REQUEST_STATUS, ACCEPTED_DOWNLOAD_REQUEST_STATUS)
    .required(),
  // updatedBy: objectId.required(),
});

module.exports = {
  createDownloadRequestSchema,
  updateDownloadRequestSchema,
};
