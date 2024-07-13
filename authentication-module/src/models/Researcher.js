const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const researcherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
    },
    lastname: {
      type: String,
      required: true,
      min: 3,
      max: 25,
    },
    occupation: "",
    area: "",
    position: "",
    institution: "",
  },
  {
    timestamps: true,
  }
);

researcherSchema.plugin(softDeletePlugin);

const researcher = mongoose.model("researchers", researcherSchema);

module.exports = researcher;
