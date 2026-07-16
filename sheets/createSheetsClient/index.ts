import { google } from "googleapis";
import type { SheetsClient } from "../../types";

// GoogleAuth reads the key file path from the GOOGLE_APPLICATION_CREDENTIALS env var
export const createSheetsClient = (): SheetsClient => {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};
