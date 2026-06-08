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
