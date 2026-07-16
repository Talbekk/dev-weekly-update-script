#!/usr/bin/env node

import dotenv from "dotenv";
import { createApiClient } from "./api";
import { getPreviousWeekRange } from "./helpers/getPreviousWeekDateRange";
import { buildWeeklyReport } from "./report/buildWeeklyReport";
import { displayReport } from "./report/displayReport";
import { createSheetsClient } from "./sheets/createSheetsClient";
import { updateScorecard } from "./sheets/updateScorecard";
dotenv.config();

const API_TOKEN = process.env.SHORTCUT_API_TOKEN;
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SCORECARD_TAB = process.env.GOOGLE_SHEETS_TAB_NAME || "Dev";

const writeToSheets = process.argv.includes("--sheets");

function validateConfig(): void {
  if (!API_TOKEN || API_TOKEN === "your_api_token_here") {
    console.error("❌ Error: SHORTCUT_API_TOKEN is not set or is using the default value.");
    console.error("Please create a .env file based on .env.example and add your Shortcut API token.");
    console.error("Get your token from: https://app.shortcut.com/settings/account/api-tokens");
    process.exit(1);
  }

  if (writeToSheets && (!SPREADSHEET_ID || SPREADSHEET_ID === "your_spreadsheet_id_here")) {
    console.error("❌ Error: --sheets requires GOOGLE_SHEETS_SPREADSHEET_ID to be set in .env.");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log("🚀 Shortcut Weekly Update Script\n");

  validateConfig();

  const client = createApiClient();

  try {
    const range = getPreviousWeekRange();
    const report = await buildWeeklyReport(client, range);

    displayReport(report);

    if (writeToSheets && SPREADSHEET_ID) {
      const sheetsClient = createSheetsClient();
      const result = await updateScorecard(sheetsClient, SPREADSHEET_ID, SCORECARD_TAB, report);
      console.log(`\n📈 Scorecard updated: ${result.updatedLabels.length} metrics written to column ${result.weekColumn}.`);
      if (result.missingLabels.length > 0) {
        console.warn(`⚠️  Labels not found in the sheet: ${result.missingLabels.join(", ")}`);
      }
    }

    console.log("\n✅ Report generated successfully!\n");
  } catch (error) {
    console.error("\n❌ Failed to generate report. Please check your configuration and try again.\n", error);
    process.exit(1);
  }
}

main();
