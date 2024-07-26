const Joi = require("joi");


const createSystemActivitySchema = Joi.object({
    type: Joi.string().required().message({
        "*": "El campo 'type' es requerido y debe ser una cadena"
    }),
    model: Joi.string().required().message({
        "*": "El campo 'model' es requerido y debe ser una cadena"
    }),
    route: Joi.string().required().message({
        "*": "El campo 'route' es requerido y debe ser una cadena"
    }),
    body: Joi.object().required().message({
        "*": "El campo 'body' es requerido y debe ser un JSON"
    }),
});

module.exports = { createSystemActivitySchema };
