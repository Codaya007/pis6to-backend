const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const CustomError = require("../errors/CustomError");
const { JWT_SECRET } = process.env;

const tokenValidation = async (tokenReceived) => {
  const [_, token] = tokenReceived?.split(" ") || [];
  if (!token) {
    throw new CustomError("No existe token", null, 404);
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const _id = decoded.id;
  const account = await Account.findOne({ _id });

  if (!account) {
    throw new CustomError("Token no valido", null, 401);
  }

  return account;
};

module.exports = tokenValidation;
