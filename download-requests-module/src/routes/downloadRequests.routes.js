var express = require("express");
var downloadRequestRouter = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const downloadRequestController = require("../controllers/downloadRequestController");
const validateRequestBody = require("../middlewares/validateRequestBody");
const {
  createDownloadRequestSchema,
  updateDownloadRequestSchema,
} = require("../models/validation-schemas/downloadRequest");
const isResearcher = require("../middlewares/isResearcher");
const isAdmin = require("../middlewares/isAdmin");

/**
 * @route GET /
 * @desc Obtener todas las solicitudes de descarga
 * @access Public
 */
downloadRequestRouter.get(
  "/",
  isAdmin,
  downloadRequestController.getAllDownloadRequest
);

/**
 * @route GET /:id
 * @desc Obtener solicitud de descarga por id
 * @access Public
 */
downloadRequestRouter.get(
  "/:id",
  isLoggedIn,
  downloadRequestController.getDownloadRequestById
);

/**
 * @route POST/
 * @desc Crear una solicitud de descarga (solo para investigadores)
 * @access Private
 */
downloadRequestRouter.post(
  "/",
  isResearcher,
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
  isAdmin,
  validateRequestBody(updateDownloadRequestSchema),
  downloadRequestController.updateDownloadRequestStatus
);

/**
 * @route GET /user
 * @desc Obtener solicitudes de descarga del usuario logueado
 * @access Private
 */
downloadRequestRouter.get(
  "/user",
  isResearcher,
  downloadRequestController.getDownloadRequestsByUser
);

module.exports = downloadRequestRouter;
