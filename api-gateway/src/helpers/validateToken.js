const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const { JWT_SECRET } = process.env;

const validateToken = async (tokenReceived) => {
  const [_, token] = tokenReceived?.split(" ") || [];
  if (!token) {
    throw new CustomError("No existe token", null, 404);
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const _id = decoded.id;
  const user = await User.findOne({ _id }).populate("role");

  if (!user) {
    throw new CustomError("Token no valido", null, 401);
  }

  return user;
};

module.exports = validateToken;
