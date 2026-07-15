import { Story } from "../../types";

const AI_LABEL_NAME: string = "AI";
const AI_LABEL_ID: number = 28947;

export const getStoriesCompletedByAI = (stories: Story[]): Story[] => {
    return stories.filter((story) => story.completed && story.labels.some((label) => label.name === AI_LABEL_NAME || label.id === AI_LABEL_ID));
};