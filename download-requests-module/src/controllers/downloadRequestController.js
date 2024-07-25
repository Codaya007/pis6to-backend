const DownloadRequest = require("../models/DownloadRequest");

// Obtener todas las solicitudes de descarga con filtro por tipo de solicitud
const getAllDownloadRequest = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type) {
      filter.requestType = type;
    }

    const downloadRequests = await DownloadRequest.find(filter);
    return res.status(200).json({
      customMessage: "Listado de solicitudes de descarga",
      results: downloadRequests,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener solicitud de descarga por ID
const getDownloadRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const downloadRequest = await DownloadRequest.findById(id);
    if (!downloadRequest) {
      return res.status(404).json({
        customMessage: "Solicitud no encontrada",
      });
    }
    return res.status(200).json({
      customMessage: "Solicitud de descarga",
      results: downloadRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Aceptar, cancelar o marcar como atendida una solicitud de descarga
const updateDownloadRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, approved } = req.body;
    const downloadRequest = await DownloadRequest.findById(id);

    if (!downloadRequest) {
      return res.status(404).json({
        customMessage: "Solicitud no encontrada",
      });
    }

    downloadRequest.status = status;
    if (approved !== undefined) {
      downloadRequest.approved = approved;
    }
    await downloadRequest.save();

    if (status === "accepted" && approved) {
      // TODO: Generar archivos en formato JSON y Excel
      // Enviar los archivos generados al email del usuario
    }

    return res.status(200).json({
      customMessage: `Solicitud ${status}`,
      results: downloadRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Crear una nueva solicitud de descarga (solo para investigadores)
const createDownloadRequest = async (req, res, next) => {
  try {
    const { userType } = req.user;
    if (userType !== "investigator") {
      return res.status(403).json({
        customMessage: "No autorizado para crear una solicitud de descarga",
      });
    }

    const { startDate, endDate, downloadType } = req.body;

    if (!startDate || !endDate || !downloadType) {
      return res.status(400).json({
        customMessage: "Faltan campos requeridos: rango de fechas y tipo de descarga",
      });
    }

    const newRequest = new DownloadRequest({
      ...req.body,
      status: "pending",
      user: req.user.userId,
    });

    await newRequest.save();

    return res.status(201).json({
      customMessage: "Solicitud creada",
      results: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener solicitudes de descarga para el usuario logueado
const getDownloadRequestsByUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const downloadRequests = await DownloadRequest.find({ user: userId });
    return res.status(200).json({
      customMessage: "Solicitudes de descarga del usuario logueado",
      results: downloadRequests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDownloadRequest,
  getDownloadRequestById,
  createDownloadRequest,
  updateDownloadRequestStatus,
  getDownloadRequestsByUser,
};
