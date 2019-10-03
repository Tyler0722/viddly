const isProduction = process.env.NODE_ENV === "production";

export const GOOGLE_LOGIN_URL = isProduction
  ? "https://api.viddly.com/auth/google"
  : "http://localhost:5000/api/auth/google";

export const CLIENT_URL = isProduction
  ? "https://api.viddly.com"
  : "http://localhost:3000";
