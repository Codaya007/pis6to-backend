var express = require("express");
var sensorRouter = express.Router();
const {
  createSensorSchema,
  editSensorSchema,
} = require("../models/validation-schemas/sensor");
const isLoggedIn = require("../middlewares/isLoggedIn");
const sensorController = require("../controllers/sensorController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /sensor-types
 *  @dec Obtener todos los tipos de sensores
 *  @access Public
 */
sensorRouter.get("/sensor-types", sensorController.getSensorTypes);

/**
 *  @route GET /
 *  @dec Obtener todos los sensores
 *  @access Public
 */
sensorRouter.get("/", sensorController.getAllSensors);

/**
 * @route GET /:id
 * @desc Obtener sensor por id
 * @access Public
 */
sensorRouter.get("/:id", sensorController.getSensorById);

/**
 * @route GET/ :id
 * @desc Obtener sensores por estacion de monitoreo
 * @access Public
 */

sensorRouter.get("/monitoring-station/:id", sensorController.getSensorsByMonitoringStation);
/**
 * @route GET/ :id
 * @desc Obtener sensores por nodo
 * @access Public
 */

sensorRouter.get("/nodo/:id", sensorController.getSensorsByNode);
/**
 * @route GET/ :id
 * @desc Obtener sensores por nodo 
 * @access Public
 */

sensorRouter.get("/node/:id", sensorController.getSensorsByMonitoringStation);


/**
 * @route POST/
 * @desc Crear sensor
 * @access Public
 */

sensorRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createSensorSchema),
  sensorController.createSensor
);

/**
 * @route PUT /:id
 * @desc Actualizar sensor por id
 * @access Public
 */

sensorRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editSensorSchema),
  sensorController.updateSensor
);

/**
 * @route DELETE /:id
 * @desc Bloquear sensor por id
 * @access Logged
 */
sensorRouter.delete("/:id", isLoggedIn, sensorController.deleteSensor);

module.exports = sensorRouter;
