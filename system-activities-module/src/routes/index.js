var express = require("express");
var router = express.Router();
const systemActivityRouter = require("./systemActivity.routes");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/system-activities", systemActivityRouter);

module.exports = router;
