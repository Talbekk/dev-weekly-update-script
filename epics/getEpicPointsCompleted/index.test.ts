import { describe, it, expect } from "vitest";
import { getEpicPointsCompleted } from "./index";
import { mockStories } from "../../mocks/shortcut";

describe("getEpicPointsCompleted", () => {
  it("sums the estimates of completed stories", () => {
    // Estimates: 101=2, 102=3, 103=1, 104=5, 106=2 (105 has a null estimate)
    expect(getEpicPointsCompleted(mockStories)).toBe(13);
  });

  it("returns 0 when given no stories", () => {
    expect(getEpicPointsCompleted([])).toBe(0);
  });

  it("ignores stories with a null estimate", () => {
    const story = { ...mockStories[0], estimate: null };
    expect(getEpicPointsCompleted([story])).toBe(0);
  });

  it("ignores stories with a zero estimate", () => {
    const story = { ...mockStories[0], estimate: 0 };
    expect(getEpicPointsCompleted([story])).toBe(0);
  });

  it("excludes stories that are not marked completed", () => {
    const story = { ...mockStories[0], completed: false };
    expect(getEpicPointsCompleted([story])).toBe(0);
  });

  it("excludes completed stories with a null completed_at", () => {
    const story = { ...mockStories[0], completed_at: null };
    expect(getEpicPointsCompleted([story])).toBe(0);
  });

  it("counts only the completed stories in a mixed list", () => {
    const stories = [
      { ...mockStories[0], estimate: 2 },                    // counted
      { ...mockStories[1], completed: false, estimate: 8 },  // excluded
      { ...mockStories[2], completed_at: null, estimate: 4 }, // excluded
      { ...mockStories[3], estimate: 3 },                    // counted
    ];
    expect(getEpicPointsCompleted(stories)).toBe(5);
  });
});
