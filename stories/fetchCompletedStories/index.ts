import { isAxiosError } from "axios";
import type { ApiClient, DateRange, Story } from "../../types";
import { groups } from "../../data/groups";

export const fetchCompletedStories = async (client: ApiClient, range: DateRange): Promise<Story[]> => {
  try {
    const { start, end } = range;
    const response = await client.post<Story[]>("/stories/search", {
      completed_at_start: start.toISOString(),
      completed_at_end: end.toISOString(),
      group_ids: [groups[0].id, groups[1].id],
    });
    console.log("🔍 Searching for stories...");
    console.log(`✅ Fetched ${response.data.length} stories from Shortcut API.`);

    const storyPointsTotal = response.data.reduce((total, story) => total + (story.estimate ?? 0), 0);
    const bugTotal = response.data.filter((story) => story.story_type === "bug").length;
    const epicStories = response.data.filter((story) => story.epic_id !== null);
    const epicStoriesPointsTotal = epicStories.reduce((total, story) => total + (story.estimate ?? 0), 0);
    const aiStories = response.data.filter((story) => story.labels?.some((label) => label.name === "AI"));

    // console.log("\n📊 Story Summary:");
    // console.log(`- Total Story Points: ${storyPointsTotal}`);
    // console.log(`- Total Completed Stories: ${response.data.length}`);
    // console.log(`- Total Bugs: ${bugTotal}`);
    // console.log(`- Stories linked to Epics: ${epicStories.length}`);
    // console.log(`- Total Story Points for Epics: ${epicStoriesPointsTotal}`);
    // console.log(`- AI-related Stories: ${aiStories.length}`);

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        console.error("❌ API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("❌ Network Error: No response received from Shortcut API");
      }
    } else if (error instanceof Error) {
      console.error("❌ Error:", error.message);
    }
    throw error;
  }
};
