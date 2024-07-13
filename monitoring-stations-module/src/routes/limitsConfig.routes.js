var express = require("express");
var limitsConfigRouter = express.Router();
const {
  createLimitsConfigSchema,
  editLimitsConfigSchema,
} = require("../models/validation-schemas/limitsconfig");
const isLoggedIn = require("../middlewares/isLoggedIn");
const limitsconfigController = require("../controllers/limitsConfigController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los limites de configuraciones
 *  @access Public
 */
limitsConfigRouter.get("/", limitsconfigController.getAllLimitsConfigs);

/**
 * @route GET /:id
 * @desc Obtener limites de configuraciones por id
 * @access Public
 */
limitsConfigRouter.get("/:id", limitsconfigController.getLimitsConfigById);

/**
 * @route POST/
 * @desc Crear limites de configuraciones
 * @access Admin
 */

limitsConfigRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createLimitsConfigSchema),
  limitsconfigController.createLimitsConfig
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
  limitsconfigController.updateLimitsConfig
);

/**
 * @route DELETE /:id
 * @desc Bloquear limites de configuraciones por id
 * @access Admin
 */
limitsConfigRouter.delete(
  "/:id",
  isLoggedIn,
  limitsconfigController.deleteLimitsConfig
);

module.exports = limitsConfigRouter;
