
import { isAxiosError } from "axios";
import type { ApiClient, CustomField, Story } from "../../types";
import { groups } from "../../data/groups";

export const fetchCustomFields = async (client: ApiClient): Promise<CustomField[]> => {
  try {
    const response = await client.get<CustomField[]>("/custom-fields");
    console.log("🔍 Fetching custom fields...");
    console.log(`✅ Fetched ${response.data.length} custom fields from Shortcut API.`);

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