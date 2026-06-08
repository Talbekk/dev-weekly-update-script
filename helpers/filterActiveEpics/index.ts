import type { Epic } from "../../types";

export const filterActiveEpics = (epics: Epic[], groupId: string): Epic[] =>
  epics.filter(
    (epic) =>
      !epic.completed &&
      !epic.archived &&
      epic.started &&
      epic.owner_ids.length > 0 &&
      epic.group_ids.includes(groupId)
  );
