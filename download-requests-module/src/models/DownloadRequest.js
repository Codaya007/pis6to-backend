const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");
const {
  ALLOWED_DOWNLOAD_REQUEST_STATUS,
  PENDING_DOWNLOAD_REQUEST_STATUS,
} = require("../constants");

const DownloadRequestSchema = new Schema(
  {
    researcher: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    filterDate: {
      from: {
        type: String,
        default: null,
      },
      to: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ALLOWED_DOWNLOAD_REQUEST_STATUS,
      default: PENDING_DOWNLOAD_REQUEST_STATUS,
    },
    sent: {
      type: Boolean,
      default: false,
      required: true,
    },
    // En este campo se guarda el id del usuario administrador que acepto o rechazo la solicitud
    updatedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

DownloadRequestSchema.plugin(softDeletePlugin);

const DownloadRequest = mongoose.model(
  "downloadrequests",
  DownloadRequestSchema
);

module.exports = DownloadRequest;
