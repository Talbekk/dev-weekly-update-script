import { describe, it, expect } from "vitest";
import { getChoresCleared } from "./index";
import { mockStories } from "../../mocks/shortcut";

describe("getChoresCleared", () => {
  it("counts chores and sums their estimates", () => {
    // ID 105 is the only chore in the fixtures, and it is unestimated
    expect(getChoresCleared(mockStories)).toEqual({
      storiesCompleted: 1,
      pointsCompleted: 0,
    });
  });

  it("returns zeroes when given no stories", () => {
    expect(getChoresCleared([])).toEqual({
      storiesCompleted: 0,
      pointsCompleted: 0,
    });
  });

  it("returns zeroes when no stories are chores", () => {
    const stories = mockStories.filter((s) => s.story_type !== "chore");
    expect(getChoresCleared(stories)).toEqual({
      storiesCompleted: 0,
      pointsCompleted: 0,
    });
  });

  it("excludes features and bugs from both counts", () => {
    const stories = [
      { ...mockStories[0], story_type: "feature" as const, estimate: 8 },
      { ...mockStories[1], story_type: "bug" as const, estimate: 13 },
      { ...mockStories[2], story_type: "chore" as const, estimate: 2 },
    ];
    expect(getChoresCleared(stories)).toEqual({
      storiesCompleted: 1,
      pointsCompleted: 2,
    });
  });

  it("sums estimates across multiple chores", () => {
    const stories = [
      { ...mockStories[0], story_type: "chore" as const, estimate: 1 },
      { ...mockStories[1], story_type: "chore" as const, estimate: 3 },
      { ...mockStories[2], story_type: "chore" as const, estimate: 5 },
    ];
    expect(getChoresCleared(stories)).toEqual({
      storiesCompleted: 3,
      pointsCompleted: 9,
    });
  });

  it("treats unestimated chores as zero points but still counts them", () => {
    const stories = [
      { ...mockStories[0], story_type: "chore" as const, estimate: null },
      { ...mockStories[1], story_type: "chore" as const, estimate: 4 },
    ];
    expect(getChoresCleared(stories)).toEqual({
      storiesCompleted: 2,
      pointsCompleted: 4,
    });
  });
});
