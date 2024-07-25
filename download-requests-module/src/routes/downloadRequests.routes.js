var express = require("express");
var downloadRequestRouter = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const downloadRequestController = require("../controllers/downloadRequestController");
const validateRequestBody = require("../middlewares/validateRequestBody");
const {
  acceptDownloadRequestSchema,
  denyDownloadRequestSchema,
  createDownloadRequestSchema,
} = require("../models/validation-schemas/downloadRequest");

/**
 * @route GET /
 * @desc Obtener todas las solicitudes de descarga
 * @access Public
 */
downloadRequestRouter.get("/", downloadRequestController.getAllDownloadRequest);

/**
 * @route GET /:id
 * @desc Obtener solicitud de descarga por id
 * @access Public
 */
downloadRequestRouter.get(
  "/:id",
  downloadRequestController.getDownloadRequestById
);

/**
 * @route POST/
 * @desc Crear una solicitud de descarga (solo para investigadores)
 * @access Private
 */
downloadRequestRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createDownloadRequestSchema),
  downloadRequestController.createDownloadRequest
);

/**
 * @route PUT /:id
 * @desc Actualizar el estado de una solicitud (aceptar, cancelar)
 * @access Admin
 */
downloadRequestRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(acceptDownloadRequestSchema),
  downloadRequestController.updateDownloadRequestStatus
);

/**
 * @route GET /user
 * @desc Obtener solicitudes de descarga del usuario logueado
 * @access Private
 */
downloadRequestRouter.get(
  "/user",
  isLoggedIn,
  downloadRequestController.getDownloadRequestsByUser
);

module.exports = downloadRequestRouter;
