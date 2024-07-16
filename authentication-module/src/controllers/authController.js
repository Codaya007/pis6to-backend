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
    return res.json({
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
       <b>Haga click en el siguiente enlace o pégelo en su navegador web para la recuperación de contraseña</b>
       <a href="${FRONTEND_BASEURL}/auth/recovery-password/${token}">${FRONTEND_BASEURL}/recovery-password/${token}</a>
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
    return res.json({ status: 400, customMessage: "Token invalido" });
  }

  if (Date.now() > user.tokenExpiresAt) {
    return res.json({ status: 401, customMessage: "Token a expirado" });
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
