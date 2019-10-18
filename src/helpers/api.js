import axios from "axios";

import { API_URL } from "helpers/constants";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});
