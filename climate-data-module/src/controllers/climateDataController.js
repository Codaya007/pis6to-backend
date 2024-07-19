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

module.exports = {
  getAllClimateData,
  getClimateDataById,
  logClimateData,
};
