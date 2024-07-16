const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { ACTIVE_USER_STATUS, BLOQUED_USER_STATUS } = require("../../constants");
const isValidCI = require("../../helpers/validateCI");

const createResearcherSchema = Joi.object({
  name: Joi.string().required().min(2).max(25).messages({
    "*": "El campo nombre es requerido y debe tener entre 2 y 30 caracteres",
  }),
  lastname: Joi.string().required().min(2).max(25).messages({
    "*": "El campo apellido es requerido y debe tener entre 2 y 30 caracteres",
  }),
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      "*": "El campo email debe ser un correo electrónico válido",
    }),
  identificationCard: Joi.string()
    .custom((value, helpers) => {
      try {
        return isValidCI(value, helpers);
      } catch (error) {
        return helpers.error(error.message);
      }
    })
    .required()
    .messages({
      "*": "La cédula es requerida y debe ser válida",
    }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().required().min(8).max(30).messages({
    "*": "El campo contraseña es requerida y debe tener entre 8 y 30 caracteres",
  }),
  occupation: Joi.string().required().max(30).messages({
    "*": "El campo 'ocupación' es requerido y debe tener hasta 30 caracteres",
  }),
  area: Joi.string().required().max(30).messages({
    "*": "El campo 'area' es requerido y debe tener hasta 30 caracteres",
  }),
  position: Joi.string().required().max(30).messages({
    "*": "El campo 'posición' es requerido y debe tener hasta 30 caracteres",
  }),
  institution: Joi.string().required().max(30).messages({
    "*": "El campo 'institución' es requerido y debe tener hasta 30 caracteres",
  }),
});

const editResearcherSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().optional().min(2).max(25).messages({
    "*": "El campo nombre debe tener entre 2 y 30 caracteres",
  }),
  lastname: Joi.string().optional().min(2).max(25).messages({
    "*": "El campo apellido debe tener entre 2 y 30 caracteres",
  }),
  email: Joi.string()
    .optional()
    .email({ tlds: { allow: false } })
    .messages({
      "*": "El campo email debe ser un correo electrónico válido",
    }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar debe ser una URL",
  }),
  password: Joi.string().optional().min(8).alphanum().max(30).messages({
    "*": "El campo contraseña debe tener entre 8 y 30 caracteres alfanuméricos",
  }),
  state: Joi.string()
    .valid(ACTIVE_USER_STATUS, BLOQUED_USER_STATUS)
    .optional()
    .messages({
      "*": `El campo estado debe ser uno de: ${ACTIVE_USER_STATUS} o ${BLOQUED_USER_STATUS}`,
    }),
  identificationCard: Joi.string()
    .custom((value, helpers) => {
      try {
        return isValidCI(value, helpers);
      } catch (error) {
        return helpers.error(error.message);
      }
    })
    .optional()
    .messages({
      "*": "La cédula es debe ser válida",
    }),
  occupation: Joi.string().max(30).messages({
    "*": "El campo 'ocupación' debe tener hasta 30 caracteres",
  }),
  area: Joi.string().required().messages({
    "*": "El campo 'area' debe tener hasta 30 caracteres",
  }),
  position: Joi.string().required().messages({
    "*": "El campo 'posición' debe tener hasta 30 caracteres",
  }),
  institution: Joi.string().required().messages({
    "*": "El campo 'institución' debe tener hasta 30 caracteres",
  }),
});

module.exports = { createResearcherSchema, editResearcherSchema };
