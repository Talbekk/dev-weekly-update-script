#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");

// Configuration
const API_TOKEN = process.env.SHORTCUT_API_TOKEN;
const PAGE_SIZE = parseInt(process.env.PAGE_SIZE || "25", 10);

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

/**
 * Fetch epics from Shortcut API
 */
async function fetchEpics(client) {
  try {
    const response = await client.get("/epics", {
      params: {
        // Additional filters can be added here if needed
      },
    });
    console.log(`✅ Fetched ${response.data.length} epics from Shortcut API.`);
    return response.data;
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
    const searchResults = await fetchEpics(client);
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
