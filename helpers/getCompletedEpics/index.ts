import { DateRange, Epic } from "../../types";

export const getCompletedEpics = (epics: Epic[], range: DateRange): Epic[] => {
    return epics.filter((epic) => {
        if (!epic.completed || !epic.completed_at) return false;
        const completedAt = new Date(epic.completed_at);
        return completedAt >= range.start && completedAt <= range.end;
    });
};