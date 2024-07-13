const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const systemActivitySchema = new Schema(
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
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

systemActivitySchema.plugin(softDeletePlugin);

const systemActivity = mongoose.model("systemactivities", systemActivitySchema);

module.exports = systemActivity;
