import { describe, it, expect } from "vitest";
import { getEpicStoriesCompleted } from "./index";
import { mockStories } from "../../mocks/shortcut";

describe("getEpicStoriesCompleted", () => {
  it("includes completed stories that belong to an epic", () => {
    expect(getEpicStoriesCompleted([mockStories[0]])).toEqual([mockStories[0]]);
  });

  it("excludes stories with a null epic_id", () => {
    const story = { ...mockStories[0], epic_id: null };
    expect(getEpicStoriesCompleted([story])).toEqual([]);
  });

  it("excludes stories that are not completed", () => {
    const story = { ...mockStories[0], completed: false };
    expect(getEpicStoriesCompleted([story])).toEqual([]);
  });

  it("returns an empty array when given no stories", () => {
    expect(getEpicStoriesCompleted([])).toEqual([]);
  });

  it("filters a mixed list down to completed, epic-linked stories", () => {
    const stories = [
      mockStories[0],                                            // included: epic_id 1, completed
      { ...mockStories[1], epic_id: null },                      // excluded: no epic
      { ...mockStories[2], completed: false },                   // excluded: not completed
      mockStories[3],                                            // included: epic_id 2, completed
    ];
    expect(getEpicStoriesCompleted(stories)).toEqual([stories[0], stories[3]]);
  });
});
