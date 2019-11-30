const express = require("express");
const axios = require("axios");
const { sign, decode } = require("jsonwebtoken");
const queryString = require("query-string");

const db = require("../../db");
const { CLIENT_URL } = require("../../helpers/constants");
const { genId } = require("../../helpers/id");

const router = express.Router();

const handleRedirect = (res, userId, redirectUrl) => {
  const cookieOptions = {
    httpOnly: true
    // secure: true
  };
  const token = genToken(userId);
  res.cookie("token", token, cookieOptions);
  res.redirect(redirectUrl);
};

const genToken = (uid) => {
  const options = {
    // expiresIn: 600,
    issuer: "https://viddly.gg"
  };
  return sign({ uid }, process.env.JWT_SECRET, options);
};

router.get("/", (req, res) => {
  const queryStr = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:5000/api/auth/google/callback",
    response_type: "code",
    scope: "profile email"
  });

  const redirect_uri = req.query.redirect_uri;
  if (redirect_uri) {
    req.session.redirectUrl = decodeURIComponent(redirect_uri);
  }

  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + queryStr);
});

router.get("/callback", (req, res) => {
  const code = req.query.code;
  const queryStr = queryString.stringify({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:5000/api/auth/google/callback",
    grant_type: "authorization_code"
  });

  const redirectUrl = req.session.redirectUrl || CLIENT_URL;

  req.session.redirectUrl = null;

  axios
    .post("https://www.googleapis.com/oauth2/v4/token?" + queryStr)
    .then((response) => {
      const { access_token, id_token } = response.data;
      const { picture, given_name, family_name, email } = decode(id_token);

      const selectQuery = 'SELECT id FROM "user" WHERE email = $1';

      return db.query(selectQuery, [email]).then((result) => {
        const user = result.rows[0];
        if (user) {
          return user;
        }
        const insertQuery =
          'INSERT INTO "user" (id, gender, email, profile_pic, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const insertValues = [genId(), null, email, picture, given_name, family_name];
        return db.query(insertQuery, insertValues).then((result) => {
          const user = result.rows[0];
          return user;
        });
      });
    })
    .then((user) => {
      handleRedirect(res, user.id, redirectUrl);
    })
    .catch((error) => {
      console.error(error.message);
    });
});

module.exports = router;
