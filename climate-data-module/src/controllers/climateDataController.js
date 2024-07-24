const { getNodeByCode } = require("../integrations/node");
const ClimateData = require("../models/ClimateData");

const getAllClimateData = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const getClimateDataById = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const logClimateData = async (req, res, next) => {
  try {
    const { nodeCode, ...climateDataBody } = req.body;

    const climateData = await ClimateData.create(climateDataBody);

    const node = await getNodeByCode(nodeCode, req.header("Authorization"));

    // console.log({ node });

    if (node) {
      climateData.node = node._id;
      climateData.monitoringStation = node.monitoringStation;
      climateData.status = node.status;

      // TODO: Añadir envío de datos a socket de climateDataNode{id_nodo} y climateDataMonitoringStation${id_station}

      climateData.save();
    }

    return res.status(201).json({
      customMessage: "Data guardad exitosamente",
      results: climateData,
    });
  } catch (error) {
    next(error);
  }
};

const getClimateDataByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const climateData = await ClimateData.find({ date });

    return res.status(200).json({
      customMessage: "Datos climáticos por fecha",
      results: climateData,
    });
  } catch (error) {
    next(error);
  }
};

const getClimateDataByNode = async (req, res, next) => {
  try {
    const { nodeCode } = req.params;
    const climateData = await ClimateData.find({ node: nodeCode });

    return res.status(200).json({
      customMessage: "Datos climáticos por nodo",
      results: climateData,
    });
  } catch (error) {
    next(error);
  }
};

const getClimateDataByMonitoringStation = async (req, res, next) => {
  try {
    const { monitoringStation } = req.params;
    const climateData = await ClimateData.find({ monitoringStation });

    return res.status(200).json({
      customMessage: "Datos climáticos por estación de monitoreo",
      results: climateData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClimateData,
  getClimateDataById,
  logClimateData,
  getClimateDataByDate,
  getClimateDataByNode,
  getClimateDataByMonitoringStation,
};
