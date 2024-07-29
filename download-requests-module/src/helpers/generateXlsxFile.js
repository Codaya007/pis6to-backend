const xlsx = require("xlsx");
const { s3upload } = require("../integrations/s3upload");
const { Types } = require("mongoose");

async function generateExcel(
  headers = [],
  data = [],
  sheetName = "Hoja1",
  token
) {
  try {
    // Convertir los datos a formato de hoja de cálculo con mapeo de headers
    const mappedData = data.map((item) => {
      const newItem = {};
      headers.forEach((header) => {
        newItem[header.text] = item[header.fieldName];
      });
      return newItem;
    });

    // Obtener los nombres de las columnas a partir de headers
    const headerTexts = headers.map((header) => header.text);

    // Crear hoja de cálculo
    const worksheet = xlsx.utils.json_to_sheet(mappedData, {
      header: headerTexts,
    });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generar el archivo Excel como un buffer
    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Subir el archivo a S3 y obtener URL
    const url = await s3upload(
      excelBuffer,
      token,
      `${new Types.ObjectId()}.xlsx`
    );

    return { url, buffer: excelBuffer };
  } catch (err) {
    console.error("Error al generar el archivo Excel:", err);
    throw new Error("Error al generar el archivo Excel");
  }
}

module.exports = generateExcel;
