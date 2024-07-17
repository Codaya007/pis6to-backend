const crypto = require("crypto");

/**
 * Genera un string urlFriendly, que puede servir como token
 * @return {String} Devuelve token
 */
const generateUrlFriendlyToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

function generateAlphanumeric(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  generateUrlFriendlyToken,
  generateAlphanumeric,
};
