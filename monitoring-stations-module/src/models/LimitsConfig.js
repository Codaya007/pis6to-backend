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

const limitsconfigSchema = new Schema({
  temp: {
    type: parameterValue,
    required: true,
  },
  press: {
    type: parameterValue,
    required: true,
  },
  hum: {
    type: parameterValue,
    required: true,
  },
  co2: {
    type: parameterValue,
    required: true,
  },
  heat: {
    type: parameterValue,
    required: true,
  },
});

limitsconfigSchema.plugin(softDeletePlugin);

const limitsconfig = mongoose.model("limitsconfig", limitsconfigSchema);

module.exports = limitsconfig;
