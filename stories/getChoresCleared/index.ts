import { Story } from "../../types";

export type ChoresCleared = {
  storiesCompleted: number;
  pointsCompleted: number;
};

export const getChoresCleared = (stories: Story[]): ChoresCleared => {
  const chores = stories.filter((story) => story.story_type === "chore");
  const storiesCompleted = chores.length;
  const pointsCompleted = chores.reduce((sum, story) => sum + (story.estimate ?? 0), 0);
  return { storiesCompleted, pointsCompleted };
};