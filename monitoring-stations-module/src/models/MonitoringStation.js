const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");
const { ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME } = require("../constants");

const monitoringStationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      default: [],
      allowNull: true,
    },
    coordinate: {
      type: [Number, Number],
      default: null,
    },
    status: {
      type: String,
      isIn: [ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME],
      default: ACTIVE_STATUS_NAME,
    },
    nomenclature: {
      type: {
        campus: {
          type: String,
          required: true,
        },
        bloque: {
          type: Number,
          required: true,
        },
        piso: {
          type: Number,
          required: true,
        },
        ambiente: {
          type: Number,
          required: true,
        },
        subAmbiente: {
          type: Number,
          default: null,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

monitoringStationSchema.plugin(softDeletePlugin);

const MonitoringStation = mongoose.model(
  "monitoringstations",
  monitoringStationSchema
);

module.exports = MonitoringStation;
