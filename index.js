#!/usr/bin/env node

import { getPreviousWeekRange } from "./helpers/getPreviousWeekDateRange/index.js";
import { createApiClient } from "./api/index.js";
import { fetchEpics } from "./epics/fetchEpics/index.js";
import { displayEpics } from "./epics/displayEpics/index.js";
import { fetchStories } from "./stories/fetchStories/index.js";
import dotenv from "dotenv";
dotenv.config();

// Configuration
const API_TOKEN = process.env.SHORTCUT_API_TOKEN;

/**
 * Validate environment variables
 */
function validateConfig() {
  if (!API_TOKEN || API_TOKEN === "your_api_token_here") {
    console.error(
      "❌ Error: SHORTCUT_API_TOKEN is not set or is using the default value.",
    );
    console.error(
      "Please create a .env file based on .env.example and add your Shortcut API token.",
    );
    console.error(
      "Get your token from: https://app.shortcut.com/settings/account/api-tokens",
    );
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Shortcut Weekly Update Script\n");

  // Validate configuration
  validateConfig();

  // Create API client
  const client = createApiClient();

  try {
    const range = getPreviousWeekRange();
    console.log(`📅 Fetching data for the week: ${range.start.toDateString()} - ${range.end.toDateString()}\n`);
    const epics = await fetchEpics(client, range);
    const stories = await fetchStories(client, range);
    displayEpics(epics);

    console.log("✅ Report generated successfully!\n");
  } catch (error) {
    console.error(
      "\n❌ Failed to generate report. Please check your configuration and try again.\n",
      error
    );
    process.exit(1);
  }
}

main();
