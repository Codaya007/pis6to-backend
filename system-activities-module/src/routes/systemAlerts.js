var express = require("express");
var systemAlertsRouter = express.Router();

const {
  createSystemAlertSchema,  // Cambiado a un schema específico para alertas
} = require("../models/validation-schemas/systemAlert");  // Cambiado a un archivo de validación para alertas
const isLoggedIn = require("../middlewares/isLoggedIn");
const systemAlertsController = require("../controllers/systemAlertsController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @desc Obtener todas las alertas
 *  @access Public
 */
systemAlertsRouter.get("/", systemAlertsController.getAllAlerts);

/**
 * @route PUT /:id
 * @desc Actualizar estado de una alerta
 * @access Public
 */

systemAlertsRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(createSystemAlertSchema),  // Cambiado a un schema específ
  systemAlertsController.markAlertAsAttended
);

/**
 * @route GET /:id
 * @desc Obtener alerta por id
 * @access Public
 */
systemAlertsRouter.get(
  "/:id",
  systemAlertsController.getAlertById
);

module.exports = systemAlertsRouter;