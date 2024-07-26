const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const systemactivitySchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    body: {
      type: JSON,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true, // Esto añadirá automáticamente createdAt y updatedAt
  }
);

// Aplicamos el plugin de borrado suave
systemactivitySchema.plugin(softDeletePlugin);

const SystemActivity = mongoose.model("SystemActivity", systemactivitySchema);

module.exports = SystemActivity;
