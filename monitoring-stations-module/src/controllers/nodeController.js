const Node = require("../models/Node");
const mongoose = require("mongoose");

const getAllNodes = async (req, res, next) => {
  try {
    const { skip = 1, limit = 10, ...where } = req.query;
    where.deletedAt = null;
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;
    // const totalCount = await Node.countDocuments(where);
    const data = await Node.find(where)
      .skip(skipValue)
      .limit(limitValue)
      .sort({ createdAt: -1 });
    // console.log(data);
    res.status(200);
    // console.log('NODESSS');
    res.json({
      msg: "OK",
      // totalCount,
      data,
    });
  } catch (error) {
    res.status(400);
    res.json({ msg: "Algo salió mal", error: error.message });
  }
  return res;
  //   try {
  //   const { skip, limit, ...where } = req.query;
  //   where.deletedAt = null;

  //   // Convertir skip y limit a números para asegurar su correcto funcionamiento
  //   const skipValue = parseInt(skip) || 0;
  //   const limitValue = parseInt(limit) || 10;

  //   const totalCount = await Node.countDocuments(where);
  //   const nodes = await Node.find(where)
  //     .populate("monitoringStation")
  //     .skip(skipValue)
  //     .limit(limitValue);

  //   return res.status(200).json({
  //     customMessage: "Nodos obtenidos exitosamente",
  //     totalCount,
  //     results: nodes,
  //   });
  // } catch (error) {
  //   next(error);
  // }
};

const getNodeByParams = async (req, res, next) => {
  const { id, code } = req.params;
  const where = {};

  if (code) where.code = code;
  if (id) where._id = new mongoose.Types.ObjectId(id);

  try {
    // console.log({ where });

    const node = await Node.findOne(where).populate("monitoringStation");

    // console.log(node);

    if (!node) {
      return next({
        status: 404,
        customMessage: "Nodo no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Nodo obtenido exitosamente",
      results: node,
    });
  } catch (error) {
    next(error);
  }
};

const updateNode = async (req, res, next) => {
  const { id } = req.params;

  try {
    const node = await Node.findById(id);

    if (!node) {
      return next({
        status: 404,
        customMessage: "Nodo no encontrado",
      });
    }

    await Node.updateOne({ _id: id }, req.body);

    return res.status(200).json({
      customMessage: "Nodo actualizada exitosamente",
      results: node,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNode = async (req, res, next) => {
  const { id } = req.params;

  try {
    const node = await Node.findById(id);

    if (!node || node.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Nodo no encontrado",
      });
    }

    await Node.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Nodo eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const createNode = async (req, res, next) => {
  const { name, ...body } = req.body;

  try {
    const nodeAlreadyExists = await Node.findOne({
      name,
      deletedAt: null,
    });

    if (nodeAlreadyExists) {
      return next({
        status: 400,
        customMessage: `Ya existe un nodo '${name}'`,
      });
    }

    const node = await Node.create({
      name,
      ...body,
    });

    return res.status(201).json({
      customMessage: "Nodo registrado exitosamente",
      results: node,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar nodo",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNodes,
  getNodeByParams,
  createNode,
  updateNode,
  deleteNode,
};
