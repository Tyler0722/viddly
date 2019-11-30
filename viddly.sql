CREATE TYPE gender AS ENUM ('male', 'female', 'other');

CREATE TABLE "user" (
  "id" bigint,
  "gender" gender,
  "email" varchar(256),
  "profile_pic" text,
  "first_name" varchar(256),
  "last_name" varchar(256),
  "username" varchar(18) UNIQUE,
  PRIMARY KEY ("id")
);

CREATE TABLE "liked_user" (
  "user_id" bigint,
  "liked_by" bigint,
  "is_liked" boolean NOT NULL,
  "liked_at" timestamp DEFAULT current_timestamp,
  PRIMARY KEY ("user_id", "liked_by")
);