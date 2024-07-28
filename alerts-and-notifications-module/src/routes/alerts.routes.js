var express = require("express");
var alertRouter = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const alertController = require("../controllers/alertController");
const validateRequestBody = require("../middlewares/validateRequestBody");
const {
  createAlertSchema,
  // editAlertSchema,
  muteAlert,
  resolveAlert,
} = require("../models/validation-schemas/alert");
const isAdmin = require("../middlewares/isAdmin");

/**
 *  @route GET /
 *  @dec Obtener todos los nodos
 *  @access Public
 */
alertRouter.get("/", isAdmin, alertController.getAllAlerts);

/**
 * @route GET /:id
 * @desc Obtener nodo por id
 * @access Public
 */
alertRouter.get("/:id", isAdmin, alertController.getAlertById);

/**
 * @route GET /:id
 * @desc Obtener status del nodo
 * @access Public
 */
alertRouter.get("/node-status/:nodeCode", alertController.getNodeAlertState);

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
 * @route PUT /resolve/:id
 * @desc Resolver alerta por id
 * @access Public
 */

alertRouter.put(
  "/resolve/:id",
  isAdmin,
  validateRequestBody(resolveAlert),
  alertController.resolveAlert
);

/**
 * @route PUT /mute/:id
 * @desc Silenciar alerta por id
 * @access Public
 */

alertRouter.put(
  "/mute/:id",
  isAdmin,
  validateRequestBody(muteAlert),
  alertController.muteAlert
);

module.exports = alertRouter;
