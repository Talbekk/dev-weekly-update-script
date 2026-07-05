import { Story } from "../../types";

export const getCompletedStoryPoints = (stories: Story[]): number => {
  return stories.reduce((total, story) => {
    if (story.completed && story.completed_at && story.estimate) {
      total += story.estimate;
    }
    return total;
  }, 0);
};