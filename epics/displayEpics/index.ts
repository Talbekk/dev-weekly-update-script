import type { Epic } from "../../types";

export const displayEpics = (epics: Epic[]): void => {
  console.log(`Found ${epics.length} completed epics:\n`);
  epics.forEach((epic) => {
    console.log(`- ${epic.name} (ID: ${epic.id})`);
    console.log(epic);
  });
};
