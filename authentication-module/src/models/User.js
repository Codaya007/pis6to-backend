const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");
const {
  ACTIVE_USER_STATUS,
  BLOQUED_USER_STATUS,
  INACTIVE_USER_STATUS,
} = require("../constants");
const isValidCI = require("../helpers/validateCI");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
    },
    lastname: {
      type: String,
      required: true,
      min: 3,
      max: 25,
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 40,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 61,
    },
    // Cedula
    identificationCard: {
      type: String,
      required: true,
      validate: {
        validator: isValidCI,
        message: "No es una cédula válida",
      },
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
    state: {
      type: String,
      maxLength: 30,
      isIn: [ACTIVE_USER_STATUS, BLOQUED_USER_STATUS, INACTIVE_USER_STATUS],
      default: ACTIVE_USER_STATUS,
    },
    token: {
      type: String,
      required: false,
    },
    tokenExpiresAt: {
      type: Date,
      required: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(softDeletePlugin);

const user = mongoose.model("users", userSchema);

module.exports = user;
