var express = require("express");
var climateDataRouter = express.Router();
const {
  createClimateDataSchema,
} = require("../models/validation-schemas/climateData");
const isLoggedIn = require("../middlewares/isLoggedIn");
const climateDataController = require("../controllers/climateDataController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los climatedataes
 *  @access Public
 */
climateDataRouter.get("/", climateDataController.getAllClimateData);

/**
 *  @route GET /
 *  @dec Obtener todos los nodos con su ultimo dato
 *  @access Public
 */
climateDataRouter.get("/nodes", climateDataController.getClimateDataAllNodes);

/**
 * @route GET /:id
 * @desc Obtener climatedata por id
 * @access Public
 */
climateDataRouter.get("/:id", climateDataController.getClimateDataById);

/**
 * @route POST/
 * @desc Crear climatedata
 * @access Public
 */

climateDataRouter.post(
  "/",
  // isLoggedIn,
  validateRequestBody(createClimateDataSchema),
  climateDataController.logClimateData
);

/**
 *  @route GET /date
 * @desc Obtener climatedata por fecha
 * @access Public
 */
climateDataRouter.get("/date", climateDataController.getClimateDataByDate);

/**
 * @route GET /node/:nodeCode
 * @desc Obtener climatedata por código de nodo
 * @access Public
 */
climateDataRouter.get(
  "/node/:nodeCode",
  climateDataController.getClimateDataByNode
);

/**
 * @route GET /station/:stationCode
 * @desc Obtener climatedata por código de estación
 * @access Public
 */
climateDataRouter.get(
  "/station/:stationCode",
  climateDataController.getClimateDataByMonitoringStation
);

module.exports = climateDataRouter;
