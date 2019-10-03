const { Router } = require("express");
const axios = require("axios");
const { decode, sign } = require("jsonwebtoken");
const queryString = require("query-string");

const genId = require("../../helpers/genId");

// TODO: Clean up file and seperate everything into their own file

const googleRouter = Router();

const CLIENT_APP_URL = "http://localhost:3000";

const { Pool } = require("pg");

const pool = new Pool();

const genToken = user => {
  const options = {
    expiresIn: 600, // expires in 10 mins
    issuer: "https://viddly.gg"
  };
  return sign(user, process.env.JWT_SECRET, options);
};

googleRouter.get("/", function(req, res) {
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

  const url = "https://accounts.google.com/o/oauth2/v2/auth?" + queryStr;

  res.redirect(url);
});

googleRouter.get("/callback", (req, res) => {
  const code = req.query.code;
  const queryStr = queryString.stringify({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:5000/api/auth/google/callback",
    grant_type: "authorization_code"
  });

  const url = "https://www.googleapis.com/oauth2/v4/token?" + queryStr;

  const redirectUrl = req.session.redirectUrl || CLIENT_APP_URL;

  req.session.redirectUrl = null;

  axios
    .post(url)
    .then(response => {
      const { access_token, id_token } = response.data;
      const { picture, given_name, family_name, email } = decode(id_token);

      const selectQuery =
        'SELECT avatar, id, email, username, first_name, last_name FROM "user" WHERE email = $1';
      const selectValues = [email];
      return pool.query(selectQuery, selectValues).then(result => {
        const user = result.rows[0];

        if (user) {
          const token = genToken(user);
          console.log(token);
          // TODO: Save token in header and have client make request to /api/me to fetch current logged in user's information
          res.cookie("token", token);
          res.redirect(redirectUrl);
        } else {
          const id = genId();
          const insertQuery =
            'INSERT INTO "user" VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
          const insertValues = [
            id,
            null,
            picture,
            given_name,
            family_name,
            email
          ];
          return pool.query(insertQuery, insertValues);
        }
      });
    })
    .then(result => {
      const user = result.rows[0];
      const token = genToken(user);

      res.cookie("token", token);

      res.redirect(redirectUrl);
    })
    .catch(error => {
      console.error(error);
      // log error to file
    });
});

module.exports = googleRouter;
