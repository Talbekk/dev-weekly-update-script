import { describe, it, expect } from "vitest";
import { getCompletedEpics } from "./index";
import { mockEpics } from "../../mocks/shortcut";
import type { DateRange } from "../../types";

const range: DateRange = {
  start: new Date("2026-05-04T00:00:00.000Z"), // Mon
  end: new Date("2026-05-10T23:59:59.999Z"),   // Sun
};

describe("getCompletedEpics", () => {
  it("returns only epics completed within the date range", () => {
    const result = getCompletedEpics(mockEpics, range);

    // IDs 1 and 2 fall in range; ID 3 is April, ID 4 is not completed
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual([1, 2]);
  });

  it("returns an empty array when no epics fall in range", () => {
    const result = getCompletedEpics(mockEpics, {
      start: new Date("2020-01-01"),
      end: new Date("2020-01-07"),
    });
    expect(result).toHaveLength(0);
  });

  it("returns an empty array when given no epics", () => {
    expect(getCompletedEpics([], range)).toEqual([]);
  });

  it("excludes epics that are not marked completed", () => {
    const result = getCompletedEpics(mockEpics, range);
    expect(result.every((e) => e.completed)).toBe(true);
  });

  it("excludes epics with a null completed_at", () => {
    const result = getCompletedEpics(mockEpics, range);
    expect(result.every((e) => e.completed_at !== null)).toBe(true);
  });

  it("includes an epic completed exactly on the range start boundary", () => {
    const epic = { ...mockEpics[0], id: 99, completed_at: range.start.toISOString() };
    const result = getCompletedEpics([epic], range);
    expect(result.map((e) => e.id)).toEqual([99]);
  });

  it("includes an epic completed exactly on the range end boundary", () => {
    const epic = { ...mockEpics[0], id: 98, completed_at: range.end.toISOString() };
    const result = getCompletedEpics([epic], range);
    expect(result.map((e) => e.id)).toEqual([98]);
  });

  it("excludes an epic completed one millisecond after the range end", () => {
    const epic = {
      ...mockEpics[0],
      id: 97,
      completed_at: new Date(range.end.getTime() + 1).toISOString(),
    };
    const result = getCompletedEpics([epic], range);
    expect(result).toHaveLength(0);
  });

  it("excludes an epic flagged completed but missing a completed_at", () => {
    const epic = { ...mockEpics[0], id: 96, completed: true, completed_at: null };
    const result = getCompletedEpics([epic], range);
    expect(result).toHaveLength(0);
  });
});
