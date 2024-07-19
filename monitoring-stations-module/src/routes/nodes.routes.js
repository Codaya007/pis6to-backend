var express = require("express");
var nodeRouter = express.Router();
const {
  createNodeSchema,
  editNodeSchema,
} = require("../models/validation-schemas/node");
const isLoggedIn = require("../middlewares/isLoggedIn");
const nodeController = require("../controllers/nodeController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los nodos
 *  @access Public
 */
nodeRouter.get("/", nodeController.getAllNodes);

/**
 * @route GET /:id
 * @desc Obtener nodo por id
 * @access Public
 */
nodeRouter.get("/:id", nodeController.getNodeByParams);

/**
 * @route GET /code/:code
 * @desc Obtener nodo por id
 * @access Public
 */
nodeRouter.get("/code/:code", nodeController.getNodeByParams);

/**
 * @route POST/
 * @desc Crear nodo
 * @access Admin
 */

nodeRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createNodeSchema),
  nodeController.createNode
);

/**
 * @route PUT /:id
 * @desc Actualizar node por id
 * @access Public
 */

nodeRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editNodeSchema),
  nodeController.updateNode
);

/**
 * @route DELETE /:id
 * @desc Bloquear nodo por id
 * @access Admin
 */
nodeRouter.delete("/:id", isLoggedIn, nodeController.deleteNode);

module.exports = nodeRouter;
