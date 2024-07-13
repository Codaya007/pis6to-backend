const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createDownloadRequestSchema = Joi.object({});

const acceptDownloadRequestSchema = Joi.object({});

const denyDownloadRequestSchema = Joi.object({});

module.exports = {
  createDownloadRequestSchema,
  acceptDownloadRequestSchema,
  denyDownloadRequestSchema,
};
