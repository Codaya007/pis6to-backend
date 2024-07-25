var express = require("express");
var router = express.Router();
const systemActivityRouter = require("./systemActivity.routes");
const systemAlertsRouter = require("./systemAlerts");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/system-activity", systemActivityRouter);
router.use("/system-alerts", systemAlertsRouter);


module.exports = router;