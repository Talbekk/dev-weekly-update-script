import { isAxiosError } from "axios";
import { ApiClient, Workflow } from "../../types";

export const fetchWorkflows = async (client: ApiClient): Promise<Workflow[]> => {
  try {
    const response = await client.get<Workflow[]>("/workflows");
    const workflows = response.data;
    console.log("🔍 Searching for workflows...");
    console.log(`✅ Fetched ${workflows.length} workflows from Shortcut API.`);
    return workflows;
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
