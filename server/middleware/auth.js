const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const authenticated = (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error === null) {
      req.session.uid = decoded.uid;
      return next();
    }
    res.status(401).json({
      message: "401: Unauthorized"
    });
  });
};

module.exports = {
  authenticated
};
