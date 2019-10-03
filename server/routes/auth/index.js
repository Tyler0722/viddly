const { Router } = require("express");

const googleRouter = require("./googleRoutes");

const router = Router();

router.use("/google", googleRouter);

// /api/users/me/relationships (send id of user via request body)
// status (accepted, denied, blocked)
// api/users/me/relationships/userId (accept request)

module.exports = router;
