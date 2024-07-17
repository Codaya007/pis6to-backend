const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { ACTIVE_USER_STATUS, BLOQUED_USER_STATUS } = require("../../constants");
const isValidCI = require("../../helpers/validateCI");

const createUserSchema = Joi.object({
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
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().optional().min(8).max(30).messages({
    "*": "El campo contraseña debe tener entre 8 y 30 caracteres",
  }),
  identificationCard: Joi.string().custom(isValidCI).required().messages({
    "*": "La cédula es requerida y debe ser válida",
  }),
});

const editUserSchema = Joi.object({
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
  identificationCard: Joi.string().custom(isValidCI).optional().messages({
    "*": "La cédula debe ser válida",
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
});

module.exports = { createUserSchema, editUserSchema };
