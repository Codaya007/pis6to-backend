const Role = require("../models/Role");

const getAllRoles = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const roles = await Role.find(where)
      .populate("role")
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Roles obtenidos exitosamente",
      results: roles,
    });
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id).populate("role");

    if (!role) {
      return next({
        status: 404,
        customMessage: "Rol no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Rol obtenido exitosamente",
      results: role,
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const role = await Role.findById(id);

    if (!role) {
      return next({
        status: 404,
        customMessage: "Rol no encontrado",
      });
    }

    if (name) role.name = name;

    await role.save();

    return res.status(200).json({
      customMessage: "Rol actualizado exitosamente",
      results: role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id);

    if (!role || role.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Rol no encontrado",
      });
    }

    await Role.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Rol eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  const { name } = req.body;

  try {
    const roleAlreadyExists = await Role.findOne({ name, deletedAt: null });

    if (roleAlreadyExists) {
      return next({
        status: 400,
        customMessage: `Ya existe un rol ${name}`,
      });
    }

    const role = await Role.create({
      name,
    });

    return res.status(201).json({
      customMessage: "Rol registrado exitosamente",
      results: role,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar rol",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  createRole,
};
