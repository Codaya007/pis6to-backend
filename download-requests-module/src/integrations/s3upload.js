const axios = require("axios");
const FormData = require("form-data");
const { API_BASEURL } = process.env;

const s3upload = async (fileBuffer, token, fileName) => {
  try {
    const url = `${API_BASEURL}/ms8/media`;

    // Crear el FormData y agregar el archivo
    const formData = new FormData();

    formData.append("file", fileBuffer, {
      filename: fileName || "file.xlsx",
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Configuración para la solicitud HTTP
    const config = {
      headers: {
        Authorization: token, // Asegúrate de pasar el token correctamente
      },
    };

    // console.log({
    //   config,
    //   formData,
    //   url,
    // });

    // Enviar la solicitud POST para subir el archivo
    const { data } = await axios.post(url, formData, config);

    if (!data.url) return null;

    // console.log({ data });

    return data.url;
  } catch (error) {
    console.error("Error al subir el archivo a S3:", error);

    return null;
  }
};

module.exports = {
  s3upload,
};
