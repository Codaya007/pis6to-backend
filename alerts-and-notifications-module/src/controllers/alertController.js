const { getNodeById, getNodeByCode } = require("../integrations/node");
const { getUserById } = require("../integrations/user");
const Alert = require("../models/Alert");

const getAllAlerts = async (req, res, next) => {
  try {
    const { skip, limit, populate = false, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await Alert.countDocuments(where);
    let alerts = await Alert.find(where)
      .skip(skipValue)
      .limit(limitValue)
      .sort({ createdAt: -1 });

    if (populate === "true") {
      alerts = await Promise.all(
        alerts.map(async (alert) => {
          alert = alert.toJSON();

          if (alert.node) {
            const node = await getNodeById(
              alert.node,
              req.header("Authorization")
            );

            alert.node = node;
          }

          if (alert.resolvedBy) {
            const user = await getUserById(
              alert.resolvedBy,
              req.header("Authorization")
            );
            alert.resolvedBy = user;
          }

          return alert;
        })
      );
    }

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
    let alert = await Alert.findById(id);

    alert = alert.toJSON();
    const node = await getNodeById(alert.node);
    alert.node = node;

    if (alert.resolvedBy) {
      const user = await getUserById(
        alert.resolvedBy,
        req.header("Authorization")
      );
      alert.resolvedBy = user;
    }

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
  const { appliedActions } = req.body;
  const resolvedBy = req.user?.id;
  const emitSound = false;
  const resolvedAt = new Date();

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    const resultado = await Alert.findByIdAndUpdate(
      id,
      {
        $set: {
          resolved: true,
          emitSound,
          resolvedBy,
          appliedActions,
          resolvedAt,
        },
      },
      { new: true } // Opcional: devuelve el documento actualizado
    );

    if (alert.node) {
      const nodeDB = await getNodeById(alert.node, req.header("Authorization"));

      //! Apagar alerta, enviar actualización por socket
      const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
      io.emit(`alertNode${nodeDB.code}`, { emitSound });
    }

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
  const { emitSound = false } = req.body;
  // const emitSound = false;

  try {
    const alert = await Alert.findById(id);

    if (!alert) {
      return next({
        status: 404,
        customMessage: "Alerta no encontrado",
      });
    }

    // await Alert.updateOne({ _id: id }, req.body);
    const resultado = await Alert.findByIdAndUpdate(
      id,
      { $set: { emitSound } },
      { new: true } // Opcional: devuelve el documento actualizado
    );

    //! Apagar alerta, enviar actualización por socket
    if (alert.node) {
      const nodeDB = await getNodeById(alert.node);

      //! Apagar alerta, enviar actualización por socket
      const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
      io.emit(`alertNode${nodeDB.code}`, { emitSound });
    }

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
    if (alert.node) {
      const nodeDB = await getNodeById(alert.node);

      //! Apagar alerta, enviar actualización por socket
      const io = req.app.get("socketio"); // Obtener la instancia de io desde req.app
      io.emit(`alertNode${nodeDB.code}`, { emitSound });
      io.emit(`alertNode`, { emitSound });
    }

    return res.status(201).json({
      customMessage: "Alerta registrada exitosamente",
      results: alert,
    });
  } catch (error) {
    console.log(error);

    return next({
      status: 500,
      customMessage: "Error al registrar la alerta",
      error: error.message,
    });
  }
};

const getNodeAlertState = async (req, res, next) => {
  try {
    const { nodeCode } = req.params;

    const nodeDB = await getNodeByCode(nodeCode);

    if (nodeDB) {
      const alertsActive = await Alert.countDocuments({
        node: nodeDB._id,
        deletedAt: null,
        emitSound: true,
        resolved: false,
      });

      if (alertsActive) {
        return res.status(200).json({
          emitSound: true,
        });
      } else {
        return res.status(200).json({
          emitSound: false,
        });
      }
    }

    return res.status(200).json({
      emitSound: false,
    });
  } catch (error) {
    console.log(error);

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
  getNodeAlertState,
};
