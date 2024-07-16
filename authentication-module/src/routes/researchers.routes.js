var express = require("express");
var researcherRouter = express.Router();
const {
  createResearcherSchema,
  editResearcherSchema,
} = require("../models/validation-schemas/researcher");
const isLoggedIn = require("../middlewares/isLoggedIn");
const researcherController = require("../controllers/researcherController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los investigadores
 *  @access Logged
 */
researcherRouter.get("/", isLoggedIn, researcherController.getAllResearchers);

/**
 * @route GET /:id
 * @desc Obtener investigador por id
 * @access Public
 */
researcherRouter.get(
  "/:id",
  isLoggedIn,
  researcherController.getResearcherById
);

/**
 * @route POST/
 * @desc Registrarse como investigador
 * @access Public
 */
researcherRouter.post(
  "/",
  validateRequestBody(createResearcherSchema),
  researcherController.registerResearcher
);

/**
 * @route PUT /:id
 * @desc Actualizar investigador por id
 * @access Public
 */
researcherRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editResearcherSchema),
  researcherController.updateResearcher
);

/**
 * @route DELETE /:id
 * @desc Bloquear usuario por id
 * @access Logged
 */
researcherRouter.delete(
  "/:id",
  isLoggedIn,
  researcherController.deleteResearcher
);

module.exports = researcherRouter;
