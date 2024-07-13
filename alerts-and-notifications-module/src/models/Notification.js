const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
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
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(softDeletePlugin);

const notification = mongoose.model("notifications", notificationSchema);

module.exports = notification;
