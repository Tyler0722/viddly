CREATE TYPE gender AS ENUM ('male', 'female', 'other');

CREATE TABLE "user" (
  "id" bigint,
  "gender" gender,
  "email" varchar(256),
  "profile_pic" text,
  "first_name" varchar(256),
  "last_name" varchar(256),
  "username" varchar(18) UNIQUE,
  PRIMARY KEY (id)
);