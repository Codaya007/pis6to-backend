const SystemActivity = require("../models/SystemActivity");


const getAllSystemActivities = (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba";
    });
  } catch (error) {
    next(error);
  }
};

const getSystemActivityById = (req, res, next) => {
  try {
    return res.status(200).json({
      customMessage: "Mensaje de prueba",
    });
  } catch (error) {
    next(error);
  }
};

const createSystemActivity = async (req, res, next) => {
  const { model, route, ...body } = req.body;

  try {
    const systemActivityAlreadyExists = await SystemActivity.findOne({
      model, 
      deleteAt: null,
    });

    if(systemActivityAlreadyExists){
      return next({
        status: 400,
        customMessage: "Actividad del sistema ya registrada"
      });
    }

    const systemActivity = await SystemActivity.create({
      model,
      route,
      ...body,
    });

    return res.status(201).json({
      customMessage: "Actividad del sistema registrada exitosamente",
      results: systemActivity,
    });

  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al guardar la actividad del sistema",
      error: error.message
    })    
  }
};

module.exports = {
  getAllSystemActivities,
  getSystemActivityById,
  createSystemActivity,
};
