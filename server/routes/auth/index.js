const { Router } = require("express");

const google = require("./google");

const router = Router();

router.use("/google", google);

module.exports = router;
