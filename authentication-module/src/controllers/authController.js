const { BLOQUED_USER_STATUS, INACTIVE_USER_STATUS } = require("../constants");
const { generateUrlFriendlyToken } = require("../helpers");
const generateToken = require("../helpers/generateToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { FRONTEND_BASEURL } = process.env;
const transporter = require("../helpers/email");
const hashValue = require("../helpers/hashValue");

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // const user = await authService.login(email, password);
  const user = await User.findOne({ email, deletedAt: null }).populate("role");

  if (!user) {
    return next({
      status: 400,
      customMessage: "La cuenta no fue encontrada",
    });
  }

  if (user.state == BLOQUED_USER_STATUS) {
    return res.json({ status: 401, customMessage: "Cuenta bloqueada" });
  }

  if (user.state == INACTIVE_USER_STATUS) {
    return res.json({ status: 401, customMessage: "Credenciales incorrectas" });
  }

  const compare = bcrypt.compareSync(password, user.password);

  if (!compare) {
    return res.json({ status: 401, customMessage: "Credenciales incorrectas" });
  }

  const payload = { id: user.id };

  const token = await generateToken(payload);

  return res.json({ customMessage: "Inicio de sesión exitoso", user, token });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  // const token = await authService.generatePasswordRecoveryToken(email);
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ status: 400, customMessage: "Email incorrecto" });
  }

  const token = generateUrlFriendlyToken();
  user.token = token;
  user.tokenExpiresAt = new Date(Date.now() + 3 * 60 * 60 * 100);
  await user.save();

  const mailOptions = {
    form: transporter.options.auth.user,
    to: email,
    subject: "Recuperacion de contraseña",
    html: `
       <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333333; text-align: center;">Recuperación de Contraseña</h2>
        <p style="color: #333333; font-size: 16px;">Haga clic en el siguiente enlace o pégelo en su navegador web para recuperar su contraseña:</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="${FRONTEND_BASEURL}/auth/reset-password/${token}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 16px;">
                Recuperar Contraseña
            </a>
        </p>
        <p style="color: #333333; font-size: 16px; text-align: center;">
            <a href="${FRONTEND_BASEURL}/auth/reset-password/${token}" style="color: #007bff;">${FRONTEND_BASEURL}/auth/reset-password/${token}</a>
        </p>
    </div>
      `,
  };
  await transporter.sendMail(mailOptions);

  return res.json({
    customMessage: "Correo enviado exitosamente",
  });
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  // const user = await authService.validateTokenUser(tokenA);
  const user = await User.findOne({ token });

  if (!user) {
    return next({ status: 400, customMessage: "Token invalido" });
  }

  if (Date.now() > user.tokenExpiresAt) {
    return next({ status: 401, customMessage: "Token a expirado" });
  }

  user.password = await hashValue(password);
  user.token = null;
  user.tokenExpiresAt = null;
  const newUser = await user.save();

  if (!newUser) {
    return next({
      status: 400,
      customMessage:
        "No se ha podido recuperar la contraseña, intente más tarde",
    });
  }

  res.json({
    customMessage: "Contraseña actualizada exitosamente",
  });
};

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
};
