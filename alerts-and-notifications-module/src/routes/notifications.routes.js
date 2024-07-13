var express = require("express");
var notificationRouter = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const notificationController = require("../controllers/notificationController");
const validateRequestBody = require("../middlewares/validateRequestBody");
const {
  createNotificationSchema,
} = require("../models/validation-schemas/notification");

/**
 *  @route GET /
 *  @dec Obtener todos los notificationes
 *  @access Public
 */
notificationRouter.get("/", notificationController.getAllNotifications);

/**
 * @route GET /:id
 * @desc Obtener notification por id
 * @access Public
 */
notificationRouter.get("/:id", notificationController.getNotificationById);

/**
 * @route POST/
 * @desc Crear notification
 * @access Public
 */

notificationRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createNotificationSchema),
  notificationController.createNotification
);

module.exports = notificationRouter;
