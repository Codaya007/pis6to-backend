const { ACTIVE_STATUS_NAME } = require("../constants");
const { getUserById } = require("../integrations/node");
const SystemActivity = require("../models/SystemActivity");
const moment = require("moment-timezone");

const getAllSystemActivities = async (req, res, next) => {
  try {
    moment.tz.setDefault("America/Bogota");
    const {
      skip,
      limit,
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

    const totalCount = await SystemActivity.countDocuments(where);
    let results = await SystemActivity.find(where)
      .skip(skipValue)
      .limit(limitValue)
      .sort({ createdAt: -1 });

    if (populate === "true") {
      results = await Promise.all(
        results.map(async (systemActivity) => {
          systemActivity = systemActivity.toJSON();

          const user = await getUserById(
            systemActivity.user,
            req.header("Authorization")
          ).catch(console.error);

          systemActivity.user = user || null;

          return systemActivity;
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

const getSystemActivityById = async (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const createSystemActivity = async (req, res, next) => {
  try {
    const { nodeCode, ...systemActivityBody } = req.body;

    const systemActivity = await SystemActivity.create(systemActivityBody);

    const node = await getNodeByCode(nodeCode, req.header("Authorization"));

    // console.log({ node });

    if (node) {
      systemActivity.node = node._id;
      systemActivity.monitoringStation = node.monitoringStation;
      systemActivity.status = node.status;

      //! Emito los datos al canal de socket correspondiente si el nodo está activo
      if (node.status === ACTIVE_STATUS_NAME) {
        const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
        io.emit(`systemActivityNode${node._id}`, systemActivity);
        io.emit(
          `systemActivityMonitoringStation${node.monitoringStation}`,
          systemActivity
        );
      }

      systemActivity.save();
    }

    return res.status(201).json({
      customMessage: "Data guardad exitosamente",
      results: systemActivity,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSystemActivities,
  getSystemActivityById,
  createSystemActivity,
};
