import { describe, it, expect } from "vitest";
import { getBugsCleared } from "./index";
import { mockStories } from "../../mocks/shortcut";

describe("getBugsCleared", () => {
  it("counts stories with a bug story_type", () => {
    // IDs 103 and 106 are bugs; the rest are features/chores
    expect(getBugsCleared(mockStories)).toBe(2);
  });

  it("returns 0 when given no stories", () => {
    expect(getBugsCleared([])).toBe(0);
  });

  it("returns 0 when no stories are bugs", () => {
    const stories = mockStories.filter((s) => s.story_type !== "bug");
    expect(getBugsCleared(stories)).toBe(0);
  });

  it("excludes features and chores", () => {
    const stories = [
      { ...mockStories[0], story_type: "feature" as const },
      { ...mockStories[1], story_type: "chore" as const },
    ];
    expect(getBugsCleared(stories)).toBe(0);
  });

  it("counts only the bugs in a mixed list", () => {
    const stories = [
      { ...mockStories[0], story_type: "bug" as const },
      { ...mockStories[1], story_type: "feature" as const },
      { ...mockStories[2], story_type: "bug" as const },
      { ...mockStories[3], story_type: "chore" as const },
    ];
    expect(getBugsCleared(stories)).toBe(2);
  });
});
