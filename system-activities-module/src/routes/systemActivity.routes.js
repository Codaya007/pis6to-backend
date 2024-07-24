var express = require("express");
var systemActivityRouter = express.Router();

const {
  createSystemActivitySchema,
} = require("../models/validation-schemas/systemActivity");
const isLoggedIn = require("../middlewares/isLoggedIn");
const systemActivityController = require("../controllers/systemActivityController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los systemactivityes
 *  @access Public
 */
systemActivityRouter.get("/", systemActivityController.getAllSystemActivities);

/**
 * @route GET /:id
 * @desc Obtener systemactivity por id
 * @access Public
 */
systemActivityRouter.get(
  "/:id",
  systemActivityController.getSystemActivityById
);

/**
 * @route POST/
 * @desc Crear systemactivity
 * @access Public
 */

systemActivityRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createSystemActivitySchema),
  systemActivityController.createSystemActivity
);

module.exports = systemActivityRouter;
