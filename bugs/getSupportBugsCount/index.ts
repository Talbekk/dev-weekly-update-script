import type { Story } from "../../types";

export const getSupportBugsCount = (bugs: Story[]): number => {
  return bugs.filter((bug: Story) => {
    return bug.external_links.length;
  }).length;
};