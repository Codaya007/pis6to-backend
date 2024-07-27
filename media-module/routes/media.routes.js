const { Router } = require("express");
const mediaController = require("../controllers/mediaController");
const upload = require("../config/multer");
const isLoggedIn = require("../middlewares/isLoggedIn");

const mediaRouter = Router();

/**
 * @route POST /
 * @desc Subir imagen a s3
 * @access Admin
 */
mediaRouter.post(
  "/",
  isLoggedIn,
  upload.single("file"),
  mediaController.uploadImage
);

module.exports = mediaRouter;
