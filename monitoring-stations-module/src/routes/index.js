var express = require("express");
const limitsConfigRouter = require("./limitsConfig.routes");
const sensorRouter = require("./sensors.routes");
const nodeRouter = require("./nodes.routes");
const monitoringstationRouter = require("./monitoringStations.routes");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/limits-config", limitsConfigRouter);
router.use("/monitoring-stations", monitoringstationRouter);
router.use("/nodes", nodeRouter);
router.use("/sensors", sensorRouter);

module.exports = router;
