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
