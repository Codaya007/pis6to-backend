const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      "*": "El campo email es requerido y debe ser un email válido",
    }),
  password: Joi.string().required().max(61).messages({
    "*": "El campo contraseña es requerida y debe tener hasta 61 caracteres",
  }),
});

module.exports = { loginSchema };
