const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");
const { ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME } = require("../constants");

const nodeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
    },
    location: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    photos: {
      type: Array,
      required: false,
      default: [],
    },
    status: {
      type: String,
      enum: [ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME],
      default: ACTIVE_STATUS_NAME,
    },
    monitoringStation: {
      type: mongoose.Types.ObjectId,
      ref: "monitoringstations",
    },
  },
  {
    timestamps: true,
  }
);

nodeSchema.plugin(softDeletePlugin);

const Node = mongoose.model("nodes", nodeSchema);

module.exports = Node;
