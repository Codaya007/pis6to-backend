var express = require("express");
var authRouter = express.Router();
const validateRequestBody = require("../middlewares/validateRequestBody");
const authController = require("../controllers/authController");
const { loginSchema } = require("../models/validation-schemas/login");

/**
 * @route POST /login
 * @desc Iniciar sesión
 * @access Public
 */
authRouter.post(
  "/login",
  validateRequestBody(loginSchema),
  authController.loginUser
);

/**
 * @route POST /recovery-password/:token
 * @desc Recuperar la contraseña usando token de recuperacion creado y enviado a su gmail
 * @access Public
 */
authRouter.post("/reset-password/:token", authController.resetPassword);

/**
 * @route POST /forgot-passord
 * @desc Generate token and send it to the email to recover it
 * @access Public
 */
authRouter.post("/forgot-password", authController.forgotPassword);

module.exports = authRouter;
