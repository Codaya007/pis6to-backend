var express = require("express");
var limitsConfigRouter = express.Router();
const {
  createLimitsConfigSchema,
  editLimitsConfigSchema,
} = require("../models/validation-schemas/limitsConfig");
const isLoggedIn = require("../middlewares/isLoggedIn");
const limitsconfigController = require("../controllers/limitsConfigController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los limites de configuraciones
 *  @access Public
 */
limitsConfigRouter.get("/", limitsconfigController.getAllLimitConfigs);

/**
 * @route GET /:id
 * @desc Obtener limites de configuraciones por id
 * @access Public
 */
limitsConfigRouter.get("/one", limitsconfigController.getOneLimitConfig);

/**
 * @route GET /:id
 * @desc Obtener limites de configuraciones por id
 * @access Public
 */
limitsConfigRouter.get("/:id", limitsconfigController.getOneLimitConfig);

/**
 * @route POST/
 * @desc Crear limites de configuraciones
 * @access Admin
 */

limitsConfigRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createLimitsConfigSchema),
  limitsconfigController.createLimitConfig
);

/**
 * @route PUT /:id
 * @desc Actualizar limitsconfig por id
 * @access Public
 */

limitsConfigRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editLimitsConfigSchema),
  limitsconfigController.updateLimitConfig
);

/**
 * @route DELETE /:id
 * @desc Bloquear limites de configuraciones por id
 * @access Admin
 */
limitsConfigRouter.delete(
  "/:id",
  isLoggedIn,
  limitsconfigController.deleteLimitConfig
);

module.exports = limitsConfigRouter;
