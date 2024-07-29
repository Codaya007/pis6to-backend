const cron = require("node-cron");
const mongoose = require("mongoose");
const ClimateData = require("../models/ClimateData");
const { getAllActiveNodes, updateNodeById } = require("../integrations/node");
const {
  getNormalLimitsConfig,
  getLimitsConfig,
} = require("../integrations/limits");
const { ACTIVE_STATUS_NAME, INACTIVE_STATUS_NAME } = require("../constants");
const {
  getMonitoringStations,
  updateMonitoringStationsById,
} = require("../integrations/monitoringStations");
const { createAlert } = require("../integrations/alerts");

const checkDamagedNodes = async () => {
  try {
    const activeNodes = await getAllActiveNodes();
    const normalLimitsConfig = await getNormalLimitsConfig();

    console.log({ activeNodes, normalLimitsConfig });

    for (const node of activeNodes) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // Filtrar datos climáticos anómalos en la última hora
      const damagedDataCount = await ClimateData.countDocuments({
        node: node._id,
        status: ACTIVE_STATUS_NAME,
        createdAt: { $gte: oneHourAgo },
        $or: [
          { temp: { $lt: normalLimitsConfig.temp.values.min } },
          { temp: { $gt: normalLimitsConfig.temp.values.max } },
          { press: { $lt: normalLimitsConfig.press.values.min } },
          { press: { $gt: normalLimitsConfig.press.values.max } },
          { hum: { $lt: normalLimitsConfig.hum.values.min } },
          { hum: { $gt: normalLimitsConfig.hum.values.max } },
          { co2: { $lt: normalLimitsConfig.co2.values.min } },
          { co2: { $gt: normalLimitsConfig.co2.values.max } },
          { heat: { $lt: normalLimitsConfig.heat.values.min } },
          { heat: { $gt: normalLimitsConfig.heat.values.max } },
        ],
      });

      console.log({ damagedDataCount });

      // Si hay más de 10 datos fuera del rango, se actualiza el nodo a inactivo y se crea una alerta
      if (damagedDataCount > 10) {
        await updateNodeById(node._id, { status: INACTIVE_STATUS_NAME });

        await createAlert({
          title: `Nodo ${node.name} inactivo`,
          description: `El nodo ${node.name} ha sido marcado como inactivo debido a más de 10 datos anómalos en la última hora.`,
          type: "FallaNodo",
          severity: "Alta",
          node: node._id,
        });
      }
    }
  } catch (error) {
    console.error("Error checking damaged nodes:", error);
  }
};

const determineEnvironmentStatus = (data, limits) => {
  let status = "Saludable";

  const outOfRangeCount = [
    {
      param: "temp",
      value: data.temp,
      min: limits.temp.values.min,
      max: limits.temp.values.max,
    },
    {
      param: "press",
      value: data.press,
      min: limits.press.values.min,
      max: limits.press.values.max,
    },
    {
      param: "hum",
      value: data.hum,
      min: limits.hum.values.min,
      max: limits.hum.values.max,
    },
    {
      param: "co2",
      value: data.co2,
      min: limits.co2.values.min,
      max: limits.co2.values.max,
    },
    {
      param: "heat",
      value: data.heat,
      min: limits.heat.values.min,
      max: limits.heat.values.max,
    },
  ].reduce((count, { value, min, max }) => {
    if (value < min || value > max) {
      return count + 1;
    }

    return count;
  }, 0);

  // Aquí puedes definir la lógica para determinar cuándo el ambiente es malo o peligroso.
  if (outOfRangeCount > 0 && outOfRangeCount <= 10) {
    status = "Malo";
  } else if (outOfRangeCount > 10) {
    status = "Peligroso";
  }

  return status;
};

const checkMonitoringStationsStatus = async () => {
  try {
    const monitoringStations = await getMonitoringStations();
    const limitsConfig = await getLimitsConfig();

    const halfHourAgo = new Date(Date.now() - 20 * 60 * 1000);

    for (const station of monitoringStations) {
      const activeData = await ClimateData.find({
        createdAt: { $gte: halfHourAgo },
        monitoringStation: station._id,
        status: ACTIVE_STATUS_NAME,
      });

      // Determinar el estado del ambiente basado en los datos activos
      let environmentalState = "Saludable";
      for (const data of activeData) {
        const currentStatus = determineEnvironmentStatus(data, limitsConfig);

        if (currentStatus === "Peligroso") {
          environmentalState = "Peligroso";
          break;
        } else if (currentStatus === "Malo") {
          environmentalState = "Malo";
        }
      }

      // Actualizar el estado de la estación de monitoreo
      await updateMonitoringStationsById(station._id, { environmentalState });

      // Crear alertas según el estado del ambiente
      if (environmentalState === "Peligroso") {
        await createAlert({
          title: `Estado ambiental Peligroso en ${station.name}`,
          description: `La estación de monitoreo ${station.name} ha detectado parámetros ambientales peligrosos.`,
          type: "Parametros no saludables",
          severity: "Alta",
          node: activeData[0].node._id,
        });
      } else if (environmentalState === "Malo") {
        await createAlert({
          title: `Estado ambiental Malo en ${station.name}`,
          description: `La estación de monitoreo ${station.name} ha detectado parámetros fuera de los límites saludables.`,
          type: "Parametros no saludables",
          severity: "Media",
          node: activeData[0].node._id,
        });
      }
    }
  } catch (error) {
    console.error("Error checking monitoring stations status:", error);
  }
};

module.exports = {
  checkDamagedNodes,
  checkMonitoringStationsStatus,
};
