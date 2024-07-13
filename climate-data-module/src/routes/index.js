var express = require("express");
const climateDataRouter = require("./climateData.routes");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/climate-data", climateDataRouter);

module.exports = router;
