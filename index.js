#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");

// Configuration
const API_TOKEN = process.env.SHORTCUT_API_TOKEN;

// Shortcut API base URL
const SHORTCUT_API_BASE = "https://api.app.shortcut.com/api/v3";

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
 * Create axios instance with Shortcut API configuration
 */
function createApiClient() {
  return axios.create({
    baseURL: SHORTCUT_API_BASE,
    headers: {
      "Shortcut-Token": API_TOKEN,
      "Content-Type": "application/json",
    },
  });
}

// Helper
function getPreviousWeekRange() {
  const now = new Date();
  const currentDay = now.getDay();
  const daysSinceMonday = (currentDay + 6) % 7;

  const currentWeekMonday = newDate(now);
  currentWeekMonday.setHours(0, 0, 0, 0);
  currentWeekMonday.setDate(now.getDate() - daysSinceMonday);

  const start = new Date(currentWeekMonday);
  start.setDate(currentWeekMonday.getDate() - 7);

  const end = new Date(currentWeekMonday);
  end.setMilliseconds(-1);

  return { start, end };
}

function formateISODate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Fetch epics from Shortcut API
 */
async function fetchEpics(client, range) {
  try {
    const response = await client.get("/epics");
    const { start, end } = range;
    const completedEpics = response.data.filter((epic) => {
      if (!epic.completed || !epic.completed_at) return false;
      const completedAt = new Date(epic.completed_at);
      return completedAt >= start && completedAt <= end;
    });
    console.log("🔍 Searching for epics...");
    console.log(`✅ Fetched ${response.data.length} epics from Shortcut API.`);
    return completedEpics;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ API Error:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("❌ Network Error: No response received from Shortcut API");
    } else {
      console.error("❌ Error:", error.message);
    }
    throw error;
  }
}

/**
 * Format and display epic information
 */
function displayEpics(searchResults) {
  const epics = searchResults || [];
  console.log(`Found ${epics.length} epics:\n`);
  console.log("epic 1:", epics[0] ? epics[0] : "No epics found");
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
    // Fetch and display stories
    const range = getPreviousWeekRange();
    const searchResults = await fetchEpics(client, range);
    displayEpics(searchResults);

    console.log("✅ Report generated successfully!\n");
  } catch (error) {
    console.error(
      "\n❌ Failed to generate report. Please check your configuration and try again.\n",
    );
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, fetchEpics, displayEpics };
