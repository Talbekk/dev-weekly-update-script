import type { ApiClient, Epic } from "../../types";
import { handleApiError } from "../../helpers/handleApiError";

export const fetchEpics = async (client: ApiClient): Promise<Epic[]> => {
  try {
    const response = await client.get<Epic[]>("/epics");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
