const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");
const {
  ACTIVE_STATUS_NAME,
  INACTIVE_STATUS_NAME,
  ALLOWED_SENSORS,
} = require("../constants");

const sensorSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ALLOWED_SENSORS,
    },
    node: {
      type: mongoose.Types.ObjectId,
      ref: "Node",
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME],
      default: ACTIVE_STATUS_NAME,
    },
  },
  {
    timestamps: true,
  }
);

sensorSchema.plugin(softDeletePlugin);

const Sensor = mongoose.model("sensors", sensorSchema);

module.exports = Sensor;
