var express = require("express");
const downloadRequestRouter = require("./downloadRequests.routes");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/download-requests", downloadRequestRouter);

module.exports = router;
