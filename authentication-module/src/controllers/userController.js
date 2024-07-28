const mongoose = require("mongoose");
const { INACTIVE_USER_STATUS, ADMIN_ROLE_NAME } = require("../constants");
const hashValue = require("../helpers/hashValue");
const User = require("../models/User");
const Role = require("../models/Role");
const { generateAlphanumeric } = require("../helpers");
const { FRONTEND_BASEURL } = process.env;
const transporter = require("../helpers/email");

const getAllUsers = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;
    where.deletedAt = null;

    const adminRole = await Role.findOne({
      deletedAt: null,
      name: ADMIN_ROLE_NAME,
    });

    if (adminRole) {
      where.role = adminRole._id;
    }

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await User.countDocuments(where);
    const users = await User.find(where)
      .populate("role")
      .skip(skipValue)
      .limit(limitValue)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      customMessage: "Usuarios obtenidos exitosamente",
      totalCount,
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
  const {
    email,
    password,
    name,
    lastname,
    identificationCard,
    avatar,
    role,
    state,
  } = req.body;

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
    if (state) user.state = state;

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
  const { email, name, lastname, identificationCard, avatar } = req.body;
  let { password } = req.body;

  // console.log("CReando usuario");

  try {
    const cuentaExist = await User.findOne({ email, deletedAt: null });

    if (cuentaExist) {
      return next({
        status: 400,
        customMessage: `Ya existe una cuenta con el email ${email}`,
      });
    }

    // console.log("Validando rol");

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

    if (!password) {
      password = generateAlphanumeric(10);
    }

    // console.log("HAsheando password");
    const hashedPassword = await hashValue(password);
    // console.log("HAsheando password fin");

    const cuenta = await User.create({
      email,
      password: hashedPassword,
      name,
      lastname,
      identificationCard,
      avatar,
      role: userRole._id,
    });

    const mailOptions = {
      form: transporter.options.auth.user,
      to: email,
      subject: "Credenciales UNL",
      html: `
       <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333333; text-align: center;">Bienvenido/a</h2>
        <p style="color: #333333; font-size: 16px;">Se ha creado una cuenta para usted en nuestro sistema. A continuación, encontrará sus credenciales de acceso:</p>
        <p style="color: #333333; font-size: 16px;"><strong>Email:</strong> ${email}</p>
        <p style="color: #333333; font-size: 16px;"><strong>Contraseña:</strong> ${password}</p>
        <p style="color: #333333; font-size: 16px;">Por favor, guarde esta información en un lugar seguro.</p>
        <p style="color: #333333; font-size: 16px;">Para acceder a su cuenta, haga clic en el siguiente enlace:</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="${FRONTEND_BASEURL}/auth/login" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 16px;">
                Iniciar Sesión
            </a>
        </p>
        <p style="color: #333333; font-size: 16px; text-align: center;">
            <a href="${FRONTEND_BASEURL}/auth/login" style="color: #007bff;">${FRONTEND_BASEURL}/login</a>
        </p>
    </div>
      `,
    };
    await transporter.sendMail(mailOptions);

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
