const { PENDING_DOWNLOAD_REQUEST_STATUS } = require("../constants");
const { removeFields } = require("../helpers");
const TRANSPORTER = require("../helpers/email");
const { generateJsonFile } = require("../helpers/generateJsonFile");
const generateExcel = require("../helpers/generateXlsxFile");
const { getAllClimateData } = require("../integrations/climateData");
const {
  getResearcherById,
  getAllResearchers,
} = require("../integrations/researcher");
const DownloadRequest = require("../models/DownloadRequest");

// Obtener todas las solicitudes de descarga con filtro por tipo de solicitud
const getAllDownloadRequest = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type) {
      filter.requestType = type;
    }

    let downloadRequests = await DownloadRequest.find(filter).sort({
      createdAt: -1,
    });

    downloadRequests = await Promise.all(
      downloadRequests.map(async (downloadReq) => {
        downloadReq = downloadReq.toJSON();

        const researcher = await getResearcherById(
          downloadReq.researcher,
          req.header("Authorization")
        );

        downloadReq.researcher = researcher;

        return downloadReq;
      })
    );

    return res.status(200).json({
      customMessage: "Listado de solicitudes de descarga",
      results: downloadRequests,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener solicitud de descarga por ID
const getDownloadRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const downloadRequest = await DownloadRequest.findById(id);

    downloadRequest = downloadReq.toJSON();

    const researcher = await getResearcherById(
      downloadRequest.researcher,
      req.header("Authorization")
    );

    downloadRequest.researcher = researcher;

    if (!downloadRequest) {
      return res.status(404).json({
        customMessage: "Solicitud no encontrada",
      });
    }

    return res.status(200).json({
      customMessage: "Solicitud de descarga",
      results: downloadRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Aceptar, cancelar o marcar como atendida una solicitud de descarga
const updateDownloadRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, approved } = req.body;
    const downloadRequest = await DownloadRequest.findById(id);

    if (!downloadRequest) {
      return res.status(404).json({
        customMessage: "Solicitud no encontrada",
      });
    }

    downloadRequest.status = status;
    if (approved !== undefined) {
      downloadRequest.approved = approved;
    }
    if (status === "Aceptada") {
      downloadRequest.approved = true;
    } else {
      downloadRequest.approved = false;
    }

    await downloadRequest.save();

    if (status === "Aceptada") {
      const filters = {};
      if (downloadRequest.filterDate.from) {
        filters.fromDate = downloadRequest.filterDate.from;
      }
      if (downloadRequest.filterDate.to) {
        filters.toDate = downloadRequest.filterDate.to;
      }

      const data = await getAllClimateData();
      const headers = [
        { fieldName: "temp", text: "Temperatura" },
        { fieldName: "hum", text: "Humedad" },
        { fieldName: "co2", text: "Co2" },
        { fieldName: "createdAt", text: "Fecha" },
        { fieldName: "status", text: "Estado" },
      ];

      // Genero archivos en formato JSON y Excel
      const { url: xlsxUrl } = await generateExcel(
        headers,
        data,
        "Data",
        req.header("Authorization")
      );

      downloadRequest.generatedFiles.xlsx = xlsxUrl || null;
      downloadRequest.save();

      // Eliminar de json campos monitoringStation, _id, node
      removeFields(data, ["monitoringStation", "node", "_id"]);

      const { url: jsonUrl } = await generateJsonFile(
        data,
        req.header("Authorization")
      );

      downloadRequest.generatedFiles.json = jsonUrl || null;
      downloadRequest.save();

      const researcherDB = await getResearcherById(
        downloadRequest.researcher,
        req.header("Authorization")
      );

      if (researcherDB) {
        // Enviar los archivos generados al email del usuario
        const mailOptions = {
          from: TRANSPORTER.options.auth.user,
          to: researcherDB.user.email,
          subject: "Solicitud de descarga de datos aprobada",
          html: `
          <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333333; text-align: center;">Solicitud Aprobada</h2>
            <p style="color: #333333; font-size: 16px;">¡Buenas noticias! Su solicitud de descarga de datos ha sido revisada y aprobada por un administrador. A continuación, encontrará los enlaces para descargar los archivos generados:</p>
            <ul style="color: #333333; font-size: 16px;">
              <li><a href="${xlsxUrl}" style="color: #007bff; text-decoration: none;">Descargar archivo Excel</a></li>
              <li><a href="${jsonUrl}" style="color: #007bff; text-decoration: none;">Descargar archivo JSON</a></li>
            </ul>
            <p style="color: #333333; font-size: 16px;">Si tiene alguna pregunta, no dude en contactarnos.</p>
            <p style="color: #333333; font-size: 16px; text-align: center;">Gracias por su solicitud.</p>
          </div>
        `,
        };

        console.log({ mailOptions });

        await TRANSPORTER.sendMail(mailOptions).catch(console.error);

        downloadRequest.sent = true;
      }

      await downloadRequest.save();
    }

    return res.status(200).json({
      customMessage: `Solicitud ${status}`,
      results: downloadRequest,
    });
  } catch (error) {
    console.error({ error });

    next(error);
  }
};

// Crear una nueva solicitud de descarga (solo para investigadores)
const createDownloadRequest = async (req, res, next) => {
  try {
    // const { userType } = req.user;
    // if (userType !== "investigator") {
    //   return res.status(403).json({
    //     customMessage: "No autorizado para crear una solicitud de descarga",
    //   });
    // }

    const { researcher } = req.body;

    const researcherDB = await getResearcherById(
      researcher,
      req.header("Authorization")
    );

    if (!researcherDB) {
      return res.status(400).json({
        customMessage: "El id de investigador no es válido",
      });
    }

    const newRequest = new DownloadRequest({
      ...req.body,
      status: PENDING_DOWNLOAD_REQUEST_STATUS,
      researcher,
    });

    await newRequest.save();

    return res.status(201).json({
      customMessage: "Solicitud creada",
      results: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener solicitudes de descarga para el usuario logueado
const getDownloadRequestsByUser = async (req, res, next) => {
  try {
    const user = req.user.id;
    // Debo obtener el researcherID
    const users = await getAllResearchers(req.header("Authorization"), {
      user,
    });
    const researcherDB = users[0];

    if (!researcherDB) {
      return res.status(404).json({
        customMessage: "Investigador no encontrado",
      });
    }

    const downloadRequests = await DownloadRequest.find({
      researcher: researcherDB?._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      customMessage: "Solicitudes de descarga del usuario logueado",
      results: downloadRequests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDownloadRequest,
  getDownloadRequestById,
  createDownloadRequest,
  updateDownloadRequestStatus,
  getDownloadRequestsByUser,
};
