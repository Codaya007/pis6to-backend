const { uploadImageToS3 } = require("../helpers/s3Helpers");

async function uploadImage(req, res, next) {
  try {
    const file = req.file;

    if (!file) {
      return next({
        status: 400,
        customMessage: "No se ha proporcionado ningún archivo",
      });
    }

    const result = await uploadImageToS3(file);

    return res.json({ url: result.Location });
  } catch (error) {
    console.log("dentro de error");
    next(error);
  }
}

module.exports = {
  uploadImage,
};
