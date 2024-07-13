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
 *  @route GET /
 *  @dec Obtener todos los sensores
 *  @access Public
 */
downloadRequestRouter.get("/", downloadRequestController.getAllDownloadRequest);

/**
 * @route GET /:id
 * @desc Obtener sensor por id
 * @access Public
 */
downloadRequestRouter.get(
  "/:id",
  downloadRequestController.getDownloadRequestById
);

/**
 * @route POST/
 * @desc Crear sensor
 * @access Public
 */

downloadRequestRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createDownloadRequestSchema),
  downloadRequestController.createDownloadRequest
);

/**
 * @route PUT /:id
 * @desc Rechazar solicitud
 * @access Admin
 */

downloadRequestRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(acceptDownloadRequestSchema),
  downloadRequestController.dennyDownloadRequest
);

/**
 * @route PUT /:id
 * @desc Aceptar solicitud
 * @access Public
 */

downloadRequestRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(denyDownloadRequestSchema),
  downloadRequestController.acceptDownloadRequest
);

module.exports = downloadRequestRouter;
