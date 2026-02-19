import axios from "axios";

// Shortcut API base URL
const SHORTCUT_API_BASE = "https://api.app.shortcut.com/api/v3";

export const createApiClient = () => {
  return axios.create({
    baseURL: SHORTCUT_API_BASE,
    headers: {
      "Shortcut-Token": process.env.SHORTCUT_API_TOKEN,
      "Content-Type": "application/json",
    },
  });
}