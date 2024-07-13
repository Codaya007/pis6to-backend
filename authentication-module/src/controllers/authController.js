const loginUser = async (req, res) => {
  res.status(200).json({ customMessage: "Inicio de sesión exitoso" });
};

const forgotPassword = async () => {};

const resetPassword = async () => {};

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
};
