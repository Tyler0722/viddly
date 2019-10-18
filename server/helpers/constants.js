const CLIENT_URL =
  process.env.NODE_ENV === "production" ? "https://viddly.gg" : "http://localhost:3000";

module.exports = {
  CLIENT_URL
};
