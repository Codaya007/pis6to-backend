const getAllDownloadRequest = () => {};

const getDownloadRequestById = () => {};

// Solo se puede editar el campo status y aproved
// Si es true, se debe generar el archivo en json y excel y enviarle al email
const acceptDownloadRequest = () => {};

// Solo se puede editar el campo status y aproved
const dennyDownloadRequest = () => {};

// Solo para investigadores
const createDownloadRequest = async () => {};

module.exports = {
  getAllDownloadRequest,
  getDownloadRequestById,
  createDownloadRequest,
  acceptDownloadRequest,
  dennyDownloadRequest,
};
