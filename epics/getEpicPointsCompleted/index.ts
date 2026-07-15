import type { Story } from "../../types";

export const getEpicPointsCompleted = (epicStories: Story[]): number => {
      return epicStories.reduce((total, story) => {
    if (story.completed && story.completed_at && story.estimate) {
      total += story.estimate;
    }
    return total;
  }, 0);
};