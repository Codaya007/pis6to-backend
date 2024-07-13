var express = require("express");
const notificationRouter = require("./notifications.routes");
const alertRouter = require("./alerts.routes");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/notifications", notificationRouter);
router.use("/alerts", alertRouter);

module.exports = router;
