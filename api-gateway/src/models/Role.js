const mongoose = require("mongoose");
const { RESEARCHER_ROLE_NAME, ADMIN_ROLE_NAME } = require("../constants");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
    isIn: [RESEARCHER_ROLE_NAME, ADMIN_ROLE_NAME],
    default: RESEARCHER_ROLE_NAME,
  },
});

const role = mongoose.model("role", roleSchema);

module.exports = role;
