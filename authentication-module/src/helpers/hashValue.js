const bcrypt = require("bcrypt");

const hashValue = async (value = "") => {
  const salt = 10;

  const hashedValue = await bcrypt.hash(value, salt);

  return hashedValue;
};

module.exports = hashValue;
