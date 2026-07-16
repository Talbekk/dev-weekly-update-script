import type { ApiClient, DateRange, Story } from "../../types";
import { productGroup, devGroup } from "../../data/groups";
import { handleApiError } from "../../helpers/handleApiError";

export const fetchCompletedStories = async (client: ApiClient, range: DateRange): Promise<Story[]> => {
  try {
    const { start, end } = range;
    const response = await client.post<Story[]>("/stories/search", {
      completed_at_start: start.toISOString(),
      completed_at_end: end.toISOString(),
      group_ids: [productGroup.id, devGroup.id],
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
