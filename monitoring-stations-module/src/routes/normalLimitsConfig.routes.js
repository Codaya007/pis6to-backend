var express = require("express");
var normallimitsConfigRouter = express.Router();
const {
  createLimitsConfigSchema,
  editLimitsConfigSchema,
} = require("../models/validation-schemas/limitsConfig");
const isLoggedIn = require("../middlewares/isLoggedIn");
const normallimitsconfigController = require("../controllers/normalLimitsConfigController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los normallimites de configuraciones
 *  @access Public
 */
normallimitsConfigRouter.get(
  "/",
  normallimitsconfigController.getAllNormalLimitConfigs
);

/**
 * @route GET /:id
 * @desc Obtener normallimites de configuraciones por id
 * @access Public
 */
normallimitsConfigRouter.get(
  "/one",
  normallimitsconfigController.getOneNormalLimitConfig
);

/**
 * @route GET /:id
 * @desc Obtener normallimites de configuraciones por id
 * @access Public
 */
normallimitsConfigRouter.get(
  "/:id",
  normallimitsconfigController.getOneNormalLimitConfig
);

/**
 * @route POST/
 * @desc Crear normallimites de configuraciones
 * @access Admin
 */

normallimitsConfigRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createLimitsConfigSchema),
  normallimitsconfigController.createNormalLimitConfig
);

/**
 * @route PUT /:id
 * @desc Actualizar normallimitsconfig por id
 * @access Public
 */

normallimitsConfigRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editLimitsConfigSchema),
  normallimitsconfigController.updateNormalLimitConfig
);

/**
 * @route DELETE /:id
 * @desc Bloquear normallimites de configuraciones por id
 * @access Admin
 */
normallimitsConfigRouter.delete(
  "/:id",
  isLoggedIn,
  normallimitsconfigController.deleteNormalLimitConfig
);

module.exports = normallimitsConfigRouter;
