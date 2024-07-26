const mongoose = require("mongoose");
const softDeletePlugin = require("../pluggins/soft-delete");
const Schema = mongoose.Schema;

// initialLimits = {
//   temp: { displayName: "Temperatura", values: { max: 30, min: 10 } },
//   press: { displayName: "Presión", values: { max: 1000, min: 500 } },
//   hum: { displayName: "Humedad", values: { max: 80, min: 20 } },
//   co2: { displayName: "Dióxido de Carbono", values: { max: 2000, min: 800 } },
//   heat: { displayName: "Calor", values: { max: 50, min: 5 } },
// };

const parameterValue = {
  displayName: String,
  values: { max: Number, min: Number },
};

const normalLimitsConfigSchema = new Schema({
  temp: {
    type: parameterValue,
    required: true,
    default: {
      displayName: "Temperatura",
      // displayName: "Temperature (°C)",
      values: { max: 50, min: -10 },
    },
  },
  press: {
    type: parameterValue,
    required: true,
    default: {
      displayName: "Presión atmosférica",
      // displayName: "Pressure (hPa)",
      values: { max: 1085, min: 870 },
    },
  },
  hum: {
    type: parameterValue,
    required: true,
    default: {
      displayName: "Humedad",
      // displayName: "Humidity (%)",
      values: { max: 100, min: 0 },
    },
  },
  co2: {
    type: parameterValue,
    required: true,
    default: {
      displayName: "CO2",
      // displayName: "CO2 (ppm)",
      values: { max: 5000, min: 0 },
    },
  },
  heat: {
    type: parameterValue,
    required: true,
    default: {
      displayName: "Calor",
      // displayName: "Heat Index (Candela)",
      values: { max: 54, min: -10 },
    },
  },
});

normalLimitsConfigSchema.plugin(softDeletePlugin);

const normalLimitsConfig = mongoose.model(
  "normallimitsconfig",
  normalLimitsConfigSchema
);

module.exports = normalLimitsConfig;
