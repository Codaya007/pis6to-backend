const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const climateDataSchema = new Schema(
  {
    temp: {
      type: Number,
      required: true,
    },
    press: {
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
    heat: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

climateDataSchema.plugin(softDeletePlugin);

const climateData = mongoose.model("climatedatas", climateDataSchema);

module.exports = climateData;
