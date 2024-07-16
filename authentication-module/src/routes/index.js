var express = require("express");
var router = express.Router();
const authRouter = require("./auth.routes");
const roleRouter = require("./roles.routes");
const userRouter = require("./users.routes");
const researcherRouter = require("./researchers.routes");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/auth", authRouter);
router.use("/researchers", researcherRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);

module.exports = router;
