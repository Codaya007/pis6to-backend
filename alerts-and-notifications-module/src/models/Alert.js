const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const alertSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["error", "warn", "success", "info"],
    },
    node: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    // Marca si ya se resolvió la alerta
    resolved: {
      type: Boolean,
      default: null,
    },
    // Cuando se actualiza el campo resolved, se guarda el id del usuario
    resolvedBy: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    // Dice si se emite un sonido en el nodo, este puede ser apagado por el admin
    emitSound: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.plugin(softDeletePlugin);

const alert = mongoose.model("alerts", alertSchema);

module.exports = alert;
