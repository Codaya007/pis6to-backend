const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const researcherSchema = new Schema(
  {
    occupation: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

researcherSchema.plugin(softDeletePlugin);

const researcher = mongoose.model("researchers", researcherSchema);

module.exports = researcher;
