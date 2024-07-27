var express = require("express");
var monitoringstationRouter = express.Router();
const {
  createMonitoringStationSchema,
  editMonitoringStationSchema,
} = require("../models/validation-schemas/monitoringStation");
const isLoggedIn = require("../middlewares/isLoggedIn");
const monitoringstationController = require("../controllers/monitoringStationController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los monitoringstationes
 *  @access Public
 */
monitoringstationRouter.get(
  "/",
  monitoringstationController.getAllMonitoringStations
);

/**
 * @route GET /:id
 * @desc Obtener monitoringstation por id
 * @access Public
 */
monitoringstationRouter.get(
  "/:id",
  monitoringstationController.getMonitoringStationById
);

/**
 * @route POST/
 * @desc Crear monitoringstation
 * @access Public
 */

monitoringstationRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createMonitoringStationSchema),
  monitoringstationController.createMonitoringStation
);

/**
 * @route PUT /:id
 * @desc Actualizar monitoringstation por id
 * @access Public
 */

monitoringstationRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editMonitoringStationSchema),
  monitoringstationController.updateMonitoringStation
);

/**
 * @route DELETE /:id
 * @desc Bloquear monitoringstation por id
 * @access Logged
 */
monitoringstationRouter.delete(
  "/:id",
  isLoggedIn,
  monitoringstationController.deleteMonitoringStation
);

module.exports = monitoringstationRouter;
