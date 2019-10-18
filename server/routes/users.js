const express = require("express");

const db = require("../db");

const router = express.Router();

router.get("/me", (req, res) => {
  const query =
    'SELECT id, gender, profile_pic, first_name, last_name, username FROM "user" WHERE id = $1';
  db.query(query, [req.session.uid]).then((result) => {
    const user = result.rows[0];
    res.json({
      user
    });
  });
});

module.exports = router;
