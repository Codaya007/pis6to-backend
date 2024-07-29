const cron = require("node-cron");
const { checkDamagedNodes, checkMonitoringStationsStatus } = require("./index");

// Tarea para verificar nodos dañados cada hora
// cron.schedule("* * * * *", async () => {
cron.schedule("0 * * * *", async () => {
  console.log("Ejecutando tarea de verificación de nodos dañados...");
  await checkDamagedNodes();
  console.log("Tarea de verificación de nodos dañados completada.");
});

// Tarea para verificar el estado de las estaciones de monitoreo cada 5 minutos
// cron.schedule("* * * * *", async () => {
cron.schedule("*/3 * * * *", async () => {
  console.log("Ejecutando tarea de verificación de estaciones de monitoreo...");
  await checkMonitoringStationsStatus();
  console.log("Tarea de verificación de estaciones de monitoreo completada.");
});
