const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      "*": "El campo email es requerido y debe ser un email válido",
    }),
  password: Joi.string().required().max(60).messages({
    "*": "El campo contraseña es requerida y debe tener hasta 60 caracteres",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      "*": "El campo email es requerido y debe ser un email válido",
    }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "*": "token no válido",
  }),
  password: Joi.string().required().min(10).max(61).messages({
    "*": "El campo contraseña es requerida y debe tener entre 10 y 61 caracteres",
  }),
});

module.exports = { loginSchema, forgotPasswordSchema, resetPasswordSchema };
