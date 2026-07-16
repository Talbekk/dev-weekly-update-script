import type { ApiClient, Story } from "../../types";
import { productGroup, devGroup } from "../../data/groups";
import { handleApiError } from "../../helpers/handleApiError";

export const fetchBugs = async (client: ApiClient): Promise<Story[]> => {
  try {
    const response = await client.post<Story[]>("/stories/search", {
      group_ids: [productGroup.id, devGroup.id],
      story_type: "bug",
      workflow_state_types: ["unstarted"],
      archived: false,
      epic_id: null,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
