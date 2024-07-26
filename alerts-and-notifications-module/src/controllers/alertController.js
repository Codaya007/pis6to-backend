const Alert = require("../models/Alert");

const getAllAlerts = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await Alert.countDocuments(where);
    const alerts = await Alert.find(where).skip(skipValue).limit(limitValue);

    return res.status(200).json({
      customMessage: "Alertas obtenidos exitosamente",
      totalCount,
      results: alerts,
    });
  } catch (error) {
    next(error);
  }
};

const getAlertById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Alerta obtenida exitosamente",
      results: alert,
    });
  } catch (error) {
    next(error);
  }
};

// id: user._id,
// name: user.name,
// lastname: user.lastname,
// email: user.email,
// roleName: user.role?.name,

const resolveAlert = async (req, res, next) => {
  const { id } = req.params;
  const { resolvedComment } = req.body;
  const resolvedBy = req.user?.id;
  const emitSound = false;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    //! Apagar alerta, enviar actualización por socket
    const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
    io.emit(`alertNode${node._id}`, { emitSound });

    const resultado = await Alert.findByIdAndUpdate(
      id,
      {
        $set: { resolved: true, emitSound, resolvedBy, resolvedComment },
      },
      { new: true } // Opcional: devuelve el documento actualizado
    );

    return res.status(200).json({
      customMessage: "Alerta actualizada exitosamente",
      results: resultado,
    });
  } catch (error) {
    next(error);
  }
};

const muteAlert = async (req, res, next) => {
  const { id } = req.params;
  const emitSound = false;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    //! Apagar alerta, enviar actualización por socket
    const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
    io.emit(`alertNode${node._id}`, { emitSound });

    // await Alert.updateOne({ _id: id }, req.body);
    const resultado = await Alert.findByIdAndUpdate(
      id,
      { $set: { emitSound } },
      { new: true } // Opcional: devuelve el documento actualizado
    );

    return res.status(200).json({
      customMessage: "Alerta actualizada exitosamente",
      results: resultado,
    });
  } catch (error) {
    next(error);
  }
};

const createAlert = async (req, res, next) => {
  try {
    const emitSound = true;
    req.body.emitSound = emitSound;

    const alert = await Alert.create(req.body);

    //! Encender alerta, enviar actualización por socket
    const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
    io.emit(`alertNode${node._id}`, { emitSound });

    return res.status(201).json({
      customMessage: "Alerta registrada exitosamente",
      results: alert,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar la alerta",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAlerts,
  getAlertById,
  createAlert,
  muteAlert,
  resolveAlert,
};
