const mongoose = require("mongoose");
const { INACTIVE_USER_STATUS, ADMIN_ROLE_NAME } = require("../constants");
const hashValue = require("../helpers/hashValue");
const User = require("../models/User");
const Role = require("../models/Role");

const getAllUsers = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const users = await User.find(where)
      .populate("role")
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Usuarios obtenidos exitosamente",
      results: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("role");

    if (!user) {
      return next({
        status: 404,
        customMessage: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      customMessage: "Usuario obtenido exitosamente",
      results: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, password, name, lastname, identificationCard, avatar, role } =
    req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(id).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();

      return next({
        status: 404,
        customMessage: "Usuario no encontrado",
      });
    }

    if (email) user.email = email;
    if (password) user.password = await hashValue(password);
    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (identificationCard) user.identificationCard = identificationCard;
    if (avatar) user.avatar = avatar;
    if (role) user.role = role;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      customMessage: "Usuario actualizado exitosamente",
      results: user,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user || user.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Usuario no encontrado",
      });
    }

    await User.updateOne(
      { _id: id },
      { deletedAt: new Date(), status: INACTIVE_USER_STATUS }
    );

    return res.status(200).json({
      customMessage: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  const { email, password, name, lastname, identificationCard, avatar } =
    req.body;

  console.log("CReando usuario");

  try {
    const cuentaExist = await User.findOne({ email, deletedAt: null });

    if (cuentaExist) {
      return next({
        status: 400,
        customMessage: `Ya existe una cuenta con el email ${email}`,
      });
    }

    console.log("Validando rol");

    const userRole = await Role.findOne({
      name: ADMIN_ROLE_NAME,
      deletedAt: null,
    });

    if (!userRole) {
      return res.status(404).json({
        customMessage: `No se puede reigistrar usuarios`,
        details: "El rol " + ADMIN_ROLE_NAME + " no existe",
      });
    }

    console.log("HAsheando password");
    const hashedPassword = await hashValue(password);
    console.log("HAsheando password fin");

    const cuenta = await User.create({
      email,
      password: hashedPassword,
      name,
      lastname,
      identificationCard,
      avatar,
      role: userRole._id,
    });

    return res.status(201).json({
      customMessage: "Usuario registrado exitosamente",
      results: cuenta,
    });
  } catch (error) {
    return next({
      status: 500,
      customMessage: "Error al registrar usuario",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
};
