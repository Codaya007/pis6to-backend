var express = require("express");
var alertRouter = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const alertController = require("../controllers/alertController");
const validateRequestBody = require("../middlewares/validateRequestBody");
const {
  createAlertSchema,
  editAlertSchema,
} = require("../models/validation-schemas/alert");

/**
 *  @route GET /
 *  @dec Obtener todos los nodos
 *  @access Public
 */
alertRouter.get("/", alertController.getAllAlerts);

/**
 * @route GET /:id
 * @desc Obtener nodo por id
 * @access Public
 */
alertRouter.get("/:id", alertController.getAlertById);

/**
 * @route POST/
 * @desc Crear nodo
 * @access Admin
 */

alertRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createAlertSchema),
  alertController.createAlert
);

/**
 * @route PUT /:id
 * @desc Actualizar alert por id
 * @access Public
 */

alertRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editAlertSchema),
  alertController.updateAlert
);

module.exports = alertRouter;
