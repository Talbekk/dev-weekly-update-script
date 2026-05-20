import { isAxiosError } from "axios";
import { ApiClient, Group } from "../../types";

export const fetchGroups = async (client: ApiClient): Promise<Group[]> => {
    try {
    const response = await client.get<Group[]>("/groups");
    const groups = response.data;
    console.log("🔍 Searching for groups...");
    console.log(`✅ Fetched ${response.data.length} groups from Shortcut API.`);
    return groups;
    // return groups.map((group) => group.name);
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
}