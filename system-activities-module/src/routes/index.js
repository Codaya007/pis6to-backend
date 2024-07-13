var express = require("express");
const systemActivityRouter = require("./systemActivity.routes");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/system-activity", systemActivityRouter);

module.exports = router;
