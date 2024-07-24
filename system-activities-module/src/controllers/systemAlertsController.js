const AlertConfig = require("../models/SystemAlerts");

const getAllAlerts = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null; // Asumiendo que usas soft delete

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await AlertConfig.countDocuments(where);
    const alerts = await AlertConfig.find(where)
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Alertas obtenidas exitosamente",
      totalCount,
      results: alerts,
    });
  } catch (error) {
    next(error);
  }
};

const markAlertAsAttended = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const updatedAlert = await AlertConfig.findByIdAndUpdate(
      alertId,
      { attended: true },
      { new: true }
    );

    if (!updatedAlert) {
      return res.status(404).json({
        customMessage: "Alerta no encontrada",
      });
    }

    return res.status(200).json({
      customMessage: "Alerta marcada como atendida exitosamente",
      result: updatedAlert,
    });
  } catch (error) {
    next(error);
  }
};

const getAlertById = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const alert = await AlertConfig.findById(alertId);

    if (!alert) {
      return res.status(404).json({
        customMessage: "Alerta no encontrada",
      });
    }

    return res.status(200).json({
      customMessage: "Detalle de alerta obtenido exitosamente",
      result: alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlerts,
  markAlertAsAttended,
  getAlertById,
};