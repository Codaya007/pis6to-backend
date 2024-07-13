var express = require("express");
var userRouter = express.Router();
const {
  createUserSchema,
  editUserSchema,
} = require("../models/validation-schemas/user");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userController = require("../controllers/userController");
const validateRequestBody = require("../middlewares/validateRequestBody");

/**
 *  @route GET /
 *  @dec Obtener todas las cuentas
 *  @access Logged
 */

userRouter.get("/", isLoggedIn, userController.getAllUsers);

/**
 * @route GET /:id
 * @desc Obtener cuenta por id
 * @access Public
 */
userRouter.get("/:id", userController.getUserById);

/**
 * @route POST/
 * @desc Crear cuenta
 * @access Public
 */

userRouter.post(
  "/",
  validateRequestBody(createUserSchema),
  userController.registerUser
);

/**
 * @route PUT /:id
 * @desc Actualizar cuenta por id
 * @access Public
 */

userRouter.put(
  "/:id",
  isLoggedIn,
  validateRequestBody(editUserSchema),
  userController.updateUser
);

/**
 * @route DELETE /:id
 * @desc Bloquear usuario por id
 * @access Logged
 */
userRouter.delete("/:id", isLoggedIn, userController.deleteUser);

module.exports = userRouter;
