#!/usr/bin/env node

import { getPreviousWeekRange } from "./helpers/getPreviousWeekDateRange";
import { createApiClient } from "./api";
import { fetchEpics } from "./epics/fetchEpics";
import { displayEpics } from "./epics/displayEpics";
import { fetchCompletedStories } from "./stories/fetchCompletedStories";
import dotenv from "dotenv";
import { fetchGroups } from "./groups/fetchGroups";
import { fetchWorkflows } from "./workflows/getWorkflows";
dotenv.config();

const API_TOKEN = process.env.SHORTCUT_API_TOKEN;

function validateConfig(): void {
  if (!API_TOKEN || API_TOKEN === "your_api_token_here") {
    console.error("❌ Error: SHORTCUT_API_TOKEN is not set or is using the default value.");
    console.error("Please create a .env file based on .env.example and add your Shortcut API token.");
    console.error("Get your token from: https://app.shortcut.com/settings/account/api-tokens");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log("🚀 Shortcut Weekly Update Script\n");

  validateConfig();

  const client = createApiClient();

  try {
    const groups = await fetchGroups(client);
    console.log("\n📋 Groups:");
    // console.log(groups);
    const range = getPreviousWeekRange();
    // const workflows = await fetchWorkflows(client);
    // console.log("\n📋 Workflows:");
    // console.log(workflows);
    // workflows.forEach((workflow) => {
    //   console.log(`- ${workflow.name} (ID: ${workflow.id})`);
    //   workflow.states.forEach((state) => {
    //     console.log('state', state);
    //   });
    // });
    console.log(`📅 Fetching data for the week: ${range.start.toDateString()} - ${range.end.toDateString()}\n`);
    const epics = await fetchEpics(client, range);
    // await fetchCompletedStories(client, range);
    // displayEpics(epics);
    const activeEpics = epics.filter((epic) => !epic.completed && !epic.archived && epic.started && epic.owner_ids.length > 0 && epic.group_ids.includes('60e2d6c1-07bf-4df8-aa8e-6d32de0cb05a'));
    console.log('activeEpics', activeEpics);
    console.log(`\n📊 Total active epics: ${activeEpics.length}`);
    activeEpics.forEach((epic) => {
      console.log(`- ${epic.name}`);
    });

    console.log("✅ Report generated successfully!\n");
  } catch (error) {
    console.error("\n❌ Failed to generate report. Please check your configuration and try again.\n", error);
    process.exit(1);
  }
}

main(); 
