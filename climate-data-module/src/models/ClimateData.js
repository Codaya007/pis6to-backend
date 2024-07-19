const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");
const { ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME } = require("../constants");

const climateDataSchema = new Schema(
  {
    temp: {
      type: Number,
      required: true,
    },
    hum: {
      type: Number,
      required: true,
    },
    co2: {
      type: Number,
      required: true,
    },
    // OPCIONALES
    press: {
      type: Number,
      // required: true,
    },
    heat: {
      type: Number,
      // required: true,
    },
    node: {
      type: mongoose.Types.ObjectId,
    },
    monitoringStation: {
      type: mongoose.Types.ObjectId,
    },
    status: {
      type: String,
      isIn: [ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME],
      default: ACTIVE_STATUS_NAME,
    },
  },
  {
    timestamps: true,
  }
);

climateDataSchema.plugin(softDeletePlugin);

const climateData = mongoose.model("climatedatas", climateDataSchema);

module.exports = climateData;
