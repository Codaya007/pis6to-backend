const { s3upload } = require("../integrations/s3upload");
const { Types } = require("mongoose");

const generateJsonFile = async (data = {}, token) => {
  try {
    // Convertir los datos a JSON
    const jsonString = JSON.stringify(data);

    // Convertir la cadena JSON a un Buffer
    const jsonBuffer = Buffer.from(jsonString, "utf-8");

    // Subir el archivo a S3 y obtener la URL
    const url = await s3upload(
      jsonBuffer,
      token,
      `${new Types.ObjectId()}.json`
    );

    return { url, json: jsonBuffer };
  } catch (error) {
    console.error("Error al generar el archivo JSON:", error);
    throw new Error("Error al generar el archivo JSON");
  }
};

module.exports = {
  generateJsonFile,
};
