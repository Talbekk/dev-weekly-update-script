import { describe, it, expect } from "vitest";
import { getStoriesCompletedByAI } from "./index";
import { mockStories } from "../../mocks/shortcut";

describe("getStoriesCompletedByAI", () => {
  it("includes completed stories labelled with the AI label name", () => {
    const story = { ...mockStories[0], labels: [{ id: 1, name: "AI" }] };
    expect(getStoriesCompletedByAI([story])).toEqual([story]);
  });

  it("includes completed stories labelled with the AI label id", () => {
    const story = { ...mockStories[0], labels: [{ id: 28947, name: "Some Other Name" }] };
    expect(getStoriesCompletedByAI([story])).toEqual([story]);
  });

  it("excludes stories without an AI label", () => {
    const story = { ...mockStories[0], labels: [{ id: 1, name: "Frontend" }] };
    expect(getStoriesCompletedByAI([story])).toEqual([]);
  });

  it("excludes stories with no labels at all", () => {
    expect(getStoriesCompletedByAI([mockStories[0]])).toEqual([]);
  });

  it("excludes AI-labelled stories that are not completed", () => {
    const story = { ...mockStories[0], completed: false, labels: [{ id: 1, name: "AI" }] };
    expect(getStoriesCompletedByAI([story])).toEqual([]);
  });

  it("returns an empty array when given no stories", () => {
    expect(getStoriesCompletedByAI([])).toEqual([]);
  });

  it("filters a mixed list down to only completed, AI-labelled stories", () => {
    const stories = [
      { ...mockStories[0], labels: [{ id: 1, name: "AI" }] },       // included
      { ...mockStories[1], labels: [{ id: 2, name: "Bug" }] },      // excluded: no AI label
      { ...mockStories[2], completed: false, labels: [{ id: 28947, name: "AI" }] }, // excluded: not completed
    ];
    expect(getStoriesCompletedByAI(stories)).toEqual([stories[0]]);
  });
});
