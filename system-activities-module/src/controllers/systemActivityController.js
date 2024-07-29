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
      customMessage: "Actividades obtenidos exitosamente",
      totalCount,
      results,
    });
  } catch (error) {
    next(error);
  }
};

const getSystemActivityById = async (req, res, next) => {
  try {
    let systemActivity = await SystemActivity.findById(req.params?.id);
    systemActivity = systemActivity.toJSON();

    const user = await getUserById(
      systemActivity.user,
      req.header("Authorization")
    ).catch(console.error);

    systemActivity.user = user || null;

    if (!systemActivity) {
      return next({
        status: 404,
        customMessage: "Actividad no encontrada",
      });
    }

    return res.status(200).json({
      customMessage: "Actividad obtenida exitosamente",
      results: systemActivity,
    });
  } catch (error) {
    next(error);
  }
};

const createSystemActivity = async (req, res, next) => {
  try {
    // req.body.user = req.user.id;
    const systemActivity = await SystemActivity.create(req.body);

    return res.status(201).json({
      customMessage: "Data guardada exitosamente",
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
