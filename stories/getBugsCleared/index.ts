import { Story } from "../../types";

export const getBugsCleared = (stories: Story[]): number => {
  return stories.filter((story) => story.story_type === "bug").length;
};
