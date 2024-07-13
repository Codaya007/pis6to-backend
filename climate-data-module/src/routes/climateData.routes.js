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
  isLoggedIn,
  validateRequestBody(createClimateDataSchema),
  climateDataController.logClimateData
);

module.exports = climateDataRouter;
