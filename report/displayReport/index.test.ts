import { describe, it, expect, vi, beforeEach } from "vitest";
import { displayReport } from "./index";
import type { WeeklyReport } from "../../types";

const report: WeeklyReport = {
  range: {
    start: "2026-05-04T00:00:00.000Z",
    end: "2026-05-10T23:59:59.999Z",
  },
  storiesCompleted: 7,
  pointsCompleted: 15,
  bugsCleared: 2,
  aiStories: [
    { id: 107, name: "Generate release notes automatically", completedAt: "2026-05-09T10:00:00.000Z", epicId: null },
  ],
  epicStoriesCompleted: 5,
  epicPointsCompleted: 12,
  epicStories: [
    { id: 101, name: "Update hero copy on landing page", completedAt: "2026-05-05T16:00:00.000Z", epicId: 1 },
  ],
  activeEpics: [{ id: 4, name: "Mobile Push Notifications" }],
  completedEpics: [{ id: 1, name: "Redesign Onboarding Flow" }],
  openBugs: {
    total: 3,
    highestPriority: 2,
    highPriority: 1,
  },
};

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

const loggedOutput = (): string =>
  vi.mocked(console.log).mock.calls.map((call) => call.join(" ")).join("\n");

describe("displayReport", () => {
  it("prints the headline metrics", () => {
    displayReport(report);
    const output = loggedOutput();

    expect(output).toContain("Total completed stories: 7");
    expect(output).toContain("Total completed story points: 15");
    expect(output).toContain("Total bugs cleared: 2");
    expect(output).toContain("Total stories completed by AI: 1");
    expect(output).toContain("Total epic stories completed: 5");
    expect(output).toContain("Total epic points completed: 12");
  });

  it("prints epic names", () => {
    displayReport(report);
    const output = loggedOutput();

    expect(output).toContain("Total completed epics: 1");
    expect(output).toContain("- Redesign Onboarding Flow");
    expect(output).toContain("Total active epics: 1");
    expect(output).toContain("- Mobile Push Notifications");
  });

  it("prints open bug counts by priority", () => {
    displayReport(report);
    const output = loggedOutput();

    expect(output).toContain("Total open bugs: 3");
    expect(output).toContain("Highest priority bugs: 2");
    expect(output).toContain("High priority bugs: 1");
  });

  it("prints AI story details", () => {
    displayReport(report);
    expect(loggedOutput()).toContain("- Generate release notes automatically - Completed at: 2026-05-09T10:00:00.000Z");
  });
});
