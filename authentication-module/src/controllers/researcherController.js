const mongoose = require("mongoose");
const { RESEARCHER_ROLE_NAME, INACTIVE_USER_STATUS } = require("../constants");
const hashValue = require("../helpers/hashValue");
const Researcher = require("../models/Researcher");
const Role = require("../models/Role");
const User = require("../models/User");

const getAllResearchers = async (req, res, next) => {
  try {
    const { skip, limit, ...where } = req.query;

    // Convertir skip y limit a números para asegurar su correcto funcionamiento
    const skipValue = parseInt(skip) || 0;
    const limitValue = parseInt(limit) || 10;

    const totalCount = await Researcher.countDocuments(where);
    const researchers = await Researcher.find(where)
      .populate({
        path: "user",
        model: User,
        populate: {
          path: "role",
          model: Role,
        },
      })
      .skip(skipValue)
      .limit(limitValue);

    return res.status(200).json({
      customMessage: "Investigadores obtenidos exitosamente",
      totalCount,
      results: researchers,
    });
  } catch (error) {
    next(error);
  }
};

const getResearcherById = async (req, res, next) => {
  let { id = req.me._id } = req.params;

  try {
    const researcher = await Researcher.findById(id).populate({
      path: "user",
      model: User,
      populate: {
        path: "role",
        model: Role,
      },
    });

    if (!researcher) {
      return next({
        status: 404,
        customMessage: "Investigador no encontrado",
      });
    }
    return res.status(200).json({
      customMessage: "Investigador obtenido exitosamente",
      results: researcher,
    });
  } catch (error) {
    next(error);
  }
};

const updateResearcher = async (req, res, next) => {
  const { id } = req.params;
  const {
    email,
    password,
    name,
    lastname,
    identificationCard,
    avatar,
    occupation,
    area,
    position,
    institution,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const researcher = await Researcher.findById(id).session(session);

    if (!researcher) {
      await session.abortTransaction();
      session.endSession();

      return next({
        status: 404,
        customMessage: "Investigador no encontrado",
      });
    }

    const user = await User.findById(researcher.user).session(session);

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

    if (occupation) researcher.occupation = occupation;
    if (area) researcher.area = area;
    if (position) researcher.position = position;
    if (institution) researcher.institution = institution;

    await user.save({ session });
    await researcher.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      customMessage: "Investigador actualizado exitosamente",
      results: researcher,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const deleteResearcher = async (req, res, next) => {
  const { id } = req.params;

  try {
    const researcher = await Researcher.findById(id);

    if (!researcher || researcher.deletedAt !== null) {
      return next({
        status: 404,
        customMessage: "Investigador no encontrado",
      });
    }

    await User.updateOne(
      { _id: researcher.user },
      { deletedAt: new Date(), status: INACTIVE_USER_STATUS }
    );

    await Researcher.updateOne({ _id: id }, { deletedAt: new Date() });

    return res.status(200).json({
      customMessage: "Investigador eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// const registerResearcher = async (req, res, next) => {
//   const {
//     email,
//     password,
//     name,
//     lastname,
//     identificationCard,
//     avatar,
//     // Datos académicos: Researcher
//     occupation,
//     area,
//     position,
//     institution,
//   } = req.body;

//   const cuentaExist = await User.findOne({ email });

//   if (cuentaExist) {
//     return next({
//       status: 400,
//       customMessage: `Ya existe una cuenta con el email ${email}`,
//     });
//   }

//   const hashedPassword = await hashPassword(password);
//   req.body.password = hashedPassword;

//   const cuenta = await User.create({
//     email,
//     password,
//     name,
//     lastname,
//     identificationCard,
//     avatar,
//   });

//   const researcher = await Researcher.create({
//     occupation,
//     area,
//     position,
//     institution,
//     user: cuenta._id,
//   });

//   researcher.user = cuenta;

//   return res.status(201).json({
//     customMessage: "Investigador registrado exitosamente",
//     results: researcher,
//   });
// };
const registerResearcher = async (req, res, next) => {
  const {
    email,
    password,
    name,
    lastname,
    identificationCard,
    avatar,
    occupation,
    area,
    position,
    institution,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cuentaExist = await User.findOne({ email }).session(session);

    if (cuentaExist) {
      return next({
        status: 400,
        customMessage: `Ya existe una cuenta con el email ${email}`,
      });
    }

    const researcherRole = await Role.findOne({
      name: RESEARCHER_ROLE_NAME,
      deletedAt: null,
    });

    if (!researcherRole) {
      return res.status(500).json({
        customMessage: "No se pueden crear investigadores",
        details: `Falta un rol ${RESEARCHER_ROLE_NAME}`,
      });
    }

    const hashedPassword = await hashValue(password);
    req.body.password = hashedPassword;

    const cuenta = await User.create(
      [
        {
          email,
          password,
          name,
          lastname,
          identificationCard,
          avatar,
          role: researcherRole._id,
        },
      ],
      { session }
    );

    const researcher = await Researcher.create(
      [
        {
          occupation,
          area,
          position,
          institution,
          user: cuenta[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    researcher[0].user = cuenta[0];

    return res.status(201).json({
      customMessage: "Investigador registrado exitosamente",
      results: researcher[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next({
      status: 500,
      customMessage: "Error al registrar investigador",
      error: error.message,
    });
  }
};

module.exports = {
  getAllResearchers,
  getResearcherById,
  updateResearcher,
  deleteResearcher,
  registerResearcher,
};
