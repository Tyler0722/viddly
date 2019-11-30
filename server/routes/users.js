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

router.put("/me", (req, res) => {
  const { username, gender } = req.body;
  const query =
    'UPDATE "user" SET username = $1, gender = $2 WHERE id = $3 RETURNING id, gender, profile_pic, first_name, last_name, username';
  db.query(query, [username, gender, req.session.uid]).then((result) => {
    const user = result.rows[0];
    res.json({
      user
    });
  });
});

router.post("/:uid/:choice(like|dislike)", (req, res) => {
  const { uid, choice } = req.params;
  const isLiked = choice === "like";

  const query =
    'INSERT INTO "liked_user" VALUES ($1, $2, $3) ON CONFLICT (user_id, liked_by) DO NOTHING';
  db.query(query, [uid, req.session.uid, isLiked]).then((result) => {
    res.send();
  });
});

module.exports = router;
