const isProduction = process.env.NODE_ENV === "production";

export const API_URL = isProduction ? "https://api.viddly.gg" : "http://localhost:5000/api";

export const CLIENT_URL = isProduction ? "https://viddly.gg" : "http://localhost:3000";

export const GOOGLE_LOGIN_URL = isProduction
  ? "https://api.viddly.gg/auth/google"
  : "http://localhost:5000/api/auth/google";
