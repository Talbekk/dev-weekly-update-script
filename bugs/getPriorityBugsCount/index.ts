import { Story } from "../../types";
import { HIGH_PRIORITY_FIELD_ID, HIGHEST_PRIORITY_FIELD_ID } from "../../constants";

export type PriorityLevel = "Highest" | "High" | "Medium" | "Low";

export const getPriorityBugsCount = (bugs: Story[], priorityLevel: PriorityLevel): number => {
    const priorityFieldId = priorityLevel === "Highest" ? HIGHEST_PRIORITY_FIELD_ID : HIGH_PRIORITY_FIELD_ID;
    const highestPriorityBugs = bugs.filter((bug) => bug.custom_fields.some((field) => field.field_id === priorityFieldId && field.value === priorityLevel));
    return highestPriorityBugs.length;
}