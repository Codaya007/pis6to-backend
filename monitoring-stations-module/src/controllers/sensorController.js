const { ALLOWED_SENSORS } = require("../constants");
const Sensor = require("../models/Sensor");
const Node = require("../models/Node");
const getAllSensors = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await Sensor.countDocuments(where);
    const sensors = await Sensor.find(where)
      .populate("node")
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Sensores obtenidos exitosamente",
      totalCount,
      results: sensors,
    });
  } catch (error) {
    next(error);
  }
};

const getSensorById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const sensor = await Sensor.findById(id).populate("node");

    if (!sensor) {
      return next({
        status: 404,
        customMessage: "Sensor no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Sensor obtenido exitosamente",
      results: sensor,
    });
  } catch (error) {
    next(error);
  }
};

const updateSensor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const sensor = await Sensor.findById(id).populate("node");

    if (!sensor) {
      return next({
        status: 404,
        customMessage: "Sensor no encontrado",
      });
    }

    await Sensor.updateOne({ _id: id }, req.body);

    return res.status(200).json({
      customMessage: "Sensor actualizado exitosamente",
      results: sensor,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSensor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const sensor = await Sensor.findById(id);

    if (!sensor || sensor.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Sensor no encontrado",
      });
    }

    await Sensor.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Sensor eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const createSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.create(req.body);

    return res.status(201).json({
      customMessage: "Sensor registrado exitosamente",
      results: sensor,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar sensor",
      error: error.message,
    });
  }
};

const getSensorTypes = (req, res) => {
  return res.json(ALLOWED_SENSORS);
};

const getSensorsByMonitoringStation = async (req, res) =>{
  try {
    const { page = 1, limit = 10, id} = req.query;
    if(!id){
      return res.status(400).json({
        msg: 'ID de la estacion de monitoreo requerido'
      });
    }
    const nodes = await Node.find({ monitoringStation:id}); //Revisar
    const nodeIds = nodes.map(node => node._id);
    const totalCount = await Sensor.countDocuments({ node: { $in: nodeIds } });
    const data = await Sensor.find({ node: { $in: nodeIds } })
      .skip((parseInt(page) - 1) * limit)
      .limit(limit)
      .exec();
    res.status(200).json({
      msg: 'OK',
      totalCount,
      data,
    });
  }catch(error){
    next(error);
  }
}

module.exports = {
  getAllSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorTypes,
  getSensorsByMonitoringStation
};
