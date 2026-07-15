import type { Story } from "../../types";

export const getEpicStoriesCompleted = (stories: Story[]): Story[] => {
    return stories.filter((story) => story.epic_id !== null && story.completed);
};