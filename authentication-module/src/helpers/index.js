const crypto = require("crypto");

/**
 * Genera un string urlFriendly, que puede servir como token
 * @return {String} Devuelve token
 */
const generateUrlFriendlyToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  generateUrlFriendlyToken,
};
