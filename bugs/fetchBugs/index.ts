
import { isAxiosError } from "axios";
import type { ApiClient, Story } from "../../types";
import { groups } from "../../data/groups";

export const fetchBugs = async (client: ApiClient): Promise<Story[]> => {
  try {
    const response = await client.post<Story[]>("/stories/search", {
        group_ids: [groups[0].id, groups[1].id],
        story_type: "bug",
        workflow_state_types: ["unstarted"],
        archived: false,
        epic_id: null,
    });
    console.log("🔍 Searching for bugs...");
    console.log(`✅ Fetched ${response.data.length} bugs from Shortcut API.`);

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