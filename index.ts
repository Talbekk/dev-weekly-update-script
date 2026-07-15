#!/usr/bin/env node

import { getPreviousWeekRange } from "./helpers/getPreviousWeekDateRange";
import { filterActiveEpics } from "./epics/filterActiveEpics";
import { createApiClient } from "./api";
import { fetchEpics } from "./epics/fetchEpics";
import dotenv from "dotenv";
import { groups } from "./data/groups";
import { getCompletedEpics } from "./epics/getCompletedEpics";
import { fetchCompletedStories } from "./stories/fetchCompletedStories";
import { getCompletedStoryPoints } from "./stories/getCompletedStoryPoints";
import { getBugsCleared } from "./stories/getBugsCleared";
import { getStoriesCompletedByAI } from "./stories/getStoriesCompletedByAI";
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
    const range = getPreviousWeekRange();
    console.log(`📅 Fetching data for the week: ${range.start.toDateString()} - ${range.end.toDateString()}\n`);

    const devGroup = groups.find((g) => g.mention_name === "dev");
    if (!devGroup) throw new Error("Development group not found in static data");

    const epics = await fetchEpics(client, range);
    // const activeEpics = filterActiveEpics(epics, devGroup.id);
    // const completedEpics = getCompletedEpics(epics, range);

    // console.log(`\n📊 Total completed epics: ${completedEpics.length}`);
    // completedEpics.forEach((epic) => {
    //     console.log(`- ${epic.name}`);
    // });
    // console.log(`\n📊 Total active epics: ${activeEpics.length}`);
    // activeEpics.forEach((epic) => {
    //   console.log(`- ${epic.name}`);
    // });

    const completedStories = await fetchCompletedStories(client, range);
    // const totalCompletedStoryPoints = getCompletedStoryPoints(completedStories);
    // const bugsCleared = getBugsCleared(completedStories);
    const storiesCompletedByAI = getStoriesCompletedByAI(completedStories);

    console.log(`\n📊 Total completed stories: ${completedStories.length}`);
    // console.log(`\n📊 Total completed story points: ${totalCompletedStoryPoints}`);
    // console.log(`\n📊 Total bugs cleared: ${bugsCleared}`);
    console.log(`\n📊 Total stories completed by AI: ${storiesCompletedByAI.length}`);
    storiesCompletedByAI.forEach((story) => {
      console.log(story);
    });

    console.log("✅ Report generated successfully!\n");
  } catch (error) {
    console.error("\n❌ Failed to generate report. Please check your configuration and try again.\n", error);
    process.exit(1);
  }
}

main(); 
