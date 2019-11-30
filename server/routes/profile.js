const express = require("express");

const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const query =
    'SELECT profile_pic, id, username, first_name, last_name FROM "user" WHERE username IS NOT NULL AND id != $1 ORDER BY random() LIMIT 2';
  db.query(query, [req.session.uid]).then((result) => {
    const profile = result.rows;
    res.json({
      profile
    });
  });
});

module.exports = router;
