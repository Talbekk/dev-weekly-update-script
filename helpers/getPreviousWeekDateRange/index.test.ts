import { describe, it, expect, vi, afterEach } from "vitest";
import { getPreviousWeekRange } from "./index";

afterEach(() => {
  vi.useRealTimers();
});

describe("getPreviousWeekRange", () => {
  it("start is always a Monday at midnight", () => {
    // Simulate calling on a Wednesday
    vi.setSystemTime(new Date("2026-05-13T10:00:00.000Z")); // Wednesday
    const { start } = getPreviousWeekRange();
    expect(start.getDay()).toBe(1); // Monday
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getSeconds()).toBe(0);
  });

  it("end is the Sunday before the current week at 23:59:59.999", () => {
    vi.setSystemTime(new Date("2026-05-13T10:00:00.000Z")); // Wednesday
    const { end } = getPreviousWeekRange();
    expect(end.getDay()).toBe(0); // Sunday
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
    expect(end.getMilliseconds()).toBe(999);
  });

  it("range spans exactly 7 days", () => {
    vi.setSystemTime(new Date("2026-05-13T10:00:00.000Z"));
    const { start, end } = getPreviousWeekRange();
    const diffMs = end.getTime() - start.getTime() + 1; // +1 for the final ms
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    expect(diffDays).toBe(7);
  });

  it("returns the correct week when called on a Monday", () => {
    vi.setSystemTime(new Date("2026-05-11T08:00:00.000Z")); // Monday
    const { start, end } = getPreviousWeekRange();
    expect(start.toDateString()).toBe("Mon May 04 2026");
    expect(end.toDateString()).toBe("Sun May 10 2026");
  });

  it("returns the correct week when called mid-week", () => {
    vi.setSystemTime(new Date("2026-05-13T15:00:00.000Z")); // Wednesday
    const { start, end } = getPreviousWeekRange();
    expect(start.toDateString()).toBe("Mon May 04 2026");
    expect(end.toDateString()).toBe("Sun May 10 2026");
  });

  it("returns the correct week when called on a Sunday", () => {
    vi.setSystemTime(new Date("2026-05-17T23:00:00.000Z")); // Sunday
    const { start, end } = getPreviousWeekRange();
    expect(start.toDateString()).toBe("Mon May 11 2026");
    expect(end.toDateString()).toBe("Sun May 17 2026");
  });
});
