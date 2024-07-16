var express = require("express");
var roleRouter = express.Router();
const {
  createRoleSchema,
  editRoleSchema,
} = require("../models/validation-schemas/role");
const isLoggedIn = require("../middlewares/isLoggedIn");
const roleController = require("../controllers/roleController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todos los roles
 *  @access Logged
 */
roleRouter.get("/", isLoggedIn, roleController.getAllRoles);

/**
 * @route GET /:id
 * @desc Obtener rol por id
 * @access Public
 */
roleRouter.get("/:id", isLoggedIn, roleController.getRoleById);

/**
 * @route POST/
 * @desc Crear rol
 * @access Public
 */
roleRouter.post(
  "/",
  isLoggedIn,
  validateRequestBody(createRoleSchema),
  roleController.createRole
);

/**
 * @route PUT /:id
 * @desc Actualizar rol por id
 * @access Public
 */
roleRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editRoleSchema),
  roleController.updateRole
);

/**
 * @route DELETE /:id
 * @desc Bloquear usuario por id
 * @access Logged
 */
roleRouter.delete("/:id", isLoggedIn, roleController.deleteRole);

module.exports = roleRouter;
