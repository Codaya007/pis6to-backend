const MonitoringStation = require("../models/MonitoringStation");

const getAllMonitoringStations = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await MonitoringStation.countDocuments(where);
    const monitoringstations = await MonitoringStation.find(where)
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Estaciones de monitoreo obtenidas exitosamente",
      totalCount,
      results: monitoringstations,
    });
  } catch (error) {
    next(error);
  }
};

const getMonitoringStationById = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const monitoringstation = await MonitoringStation.findById(id);

    if (!monitoringstation) {
      return next({
        status: 404,
        customMessage: "Estación de monitoreo no encontrada",
      });
    }

    return res.status(200).json({
      customMessage: "Estación de monitoreo obtenida exitosamente",
      results: monitoringstation,
    });
  } catch (error) {
    next(error);
  }
};

const updateMonitoringStation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const monitoringstation = await MonitoringStation.findById(id);

    if (!monitoringstation) {
      return next({
        status: 404,
        customMessage: "Estación de monitoreo no encontrada",
      });
    }

    await MonitoringStation.updateOne({ _id: id }, req.body);

    return res.status(200).json({
      customMessage: "Estación de monitoreo actualizada exitosamente",
      results: monitoringstation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMonitoringStation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const monitoringstation = await MonitoringStation.findById(id);

    if (!monitoringstation || monitoringstation.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Estación de monitoreo no encontrada",
      });
    }

    await MonitoringStation.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Estación de monitoreo eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const createMonitoringStation = async (req, res, next) => {
  const { name, ...body } = req.body;

  try {
    const monitoringstationAlreadyExists = await MonitoringStation.findOne({
      name,
      deletedAt: null,
    });

    if (monitoringstationAlreadyExists) {
      return next({
        status: 400,
        customMessage: `Ya existe un estación de monitoreo '${name}'`,
      });
    }
    console.log(body);
    const monitoringstation = await MonitoringStation.create({
      name,
      ...body,
    });

    return res.status(201).json({
      customMessage: "Estación de monitoreo registrada exitosamente",
      results: monitoringstation,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar estación de monitoreo",
      error: error.message,
    });
  }
};

module.exports = {
  getAllMonitoringStations,
  getMonitoringStationById,
  createMonitoringStation,
  updateMonitoringStation,
  deleteMonitoringStation,
};
