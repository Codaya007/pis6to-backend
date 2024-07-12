const process = require("../src/config");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Configuración global para eliminar campos sensibles al convertir a JSON
    mongoose.set("toJSON", {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.tokenExpiresAt;
        delete ret.token;
      },
    });

    const connection = await mongoose.connect(process.db.url);

    console.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error("No ha sido posible realizar una conexión con la BBDD");
    console.error(` Error: ${err.message} `);

    throw err;
  }
};

module.exports = connectDB;
