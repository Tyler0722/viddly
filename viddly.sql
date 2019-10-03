/* create user table */
CREATE TABLE "user" (
  "id" integer PRIMARY KEY,
  "username" varchar(18) UNIQUE,
  "avatar" text NULL,
  "first_name" varchar(256),
  "last_name" varchar(256),
  "email" varchar(256)
);