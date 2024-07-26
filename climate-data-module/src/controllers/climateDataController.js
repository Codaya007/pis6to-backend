const { ACTIVE_STATUS_NAME } = require("../constants");
const {
  getNodeByCode,
  getNodeById,
  getAllActiveNodes,
} = require("../integrations/node");
const ClimateData = require("../models/ClimateData");
const moment = require("moment-timezone");

const getAllClimateData = async (req, res, next) => {
  try {
    moment.tz.setDefault("America/Bogota");
    const {
      skip,
      limit,
      nodeCode,
      toDate,
      fromDate,
      populate = false,
      ...where
    } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    if (toDate || fromDate) {
      where.createdAt = {};

      if (fromDate) {
        where.createdAt["$gte"] = moment(fromDate).toDate();
      }

      if (toDate) {
        where.createdAt["$lte"] = moment(toDate).toDate();
      }
    }

    if (nodeCode) {
      const node = await getNodeByCode(nodeCode);

      console.log({ node });

      if (!node) {
        return res.status(404).json({
          customMessage: `Nodo ${nodeCode} no encontrado`,
        });
      }

      where.node = node._id;
    }

    const totalCount = await ClimateData.countDocuments(where);
    let results = await ClimateData.find(where)
      .skip(skipValue)
      .limit(limitValue)
      .sort({ createdAt: -1 });

    if (populate === "true") {
      results = await Promise.all(
        results.map(async (climateData) => {
          climateData = climateData.toJSON();
          const node = await getNodeById(climateData.node).catch(console.error);

          climateData.node = node || null;

          return climateData;
        })
      );
    }

    return res.status(200).json({
      customMessage: "Datos climáticos obtenidos exitosamente",
      totalCount,
      results,
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

      //! Emito los datos al canal de socket correspondiente si el nodo está activo
      if (node.status === ACTIVE_STATUS_NAME) {
        const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
        io.emit(`climateData`, climateData);
        io.emit(`climateDataNode${node._id}`, climateData);
        io.emit(
          `climateDataMonitoringStation${node.monitoringStation}`,
          climateData
        );
      }

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

const getClimateDataAllNodes = async (req, res, next) => {
  try {
    const { monitoringStation } = req.query;

    let nodes = await getAllActiveNodes(
      req.header("Authorization"),
      monitoringStation
    );

    await Promise.all(
      nodes.map(async (node) => {
        const lastClimateData = await ClimateData.find({ node: node._id })
          .sort({ createdAt: -1 })
          .limit(1);

        node.lastClimateData = lastClimateData[0] || null;
      })
    );

    return res.status(200).json({
      customMessage: "Datos climáticos por nodo",
      results: nodes,
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
  getClimateDataAllNodes,
};
