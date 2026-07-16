import { describe, it, expect, vi } from "vitest";
import { buildWeeklyReport } from "./index";
import { mockEpics, mockStories } from "../../mocks/shortcut";
import { HIGHEST_PRIORITY_FIELD_ID, HIGH_PRIORITY_FIELD_ID } from "../../constants";
import type { ApiClient, DateRange, Story } from "../../types";

const range: DateRange = {
  start: new Date("2026-05-04T00:00:00.000Z"),
  end: new Date("2026-05-10T23:59:59.999Z"),
};

const makeBug = (id: number, fieldId: string, value: string): Story => ({
  id,
  name: `Bug ${id}`,
  estimate: null,
  story_type: "bug",
  epic_id: null,
  labels: [],
  completed: false,
  completed_at: null,
  created_at: "2026-05-01T09:00:00.000Z",
  updated_at: "2026-05-01T09:00:00.000Z",
  custom_fields: [{ field_id: fieldId, value, value_id: "value-1" }],
});

const mockBugs: Story[] = [
  makeBug(201, HIGHEST_PRIORITY_FIELD_ID, "Highest"),
  makeBug(202, HIGHEST_PRIORITY_FIELD_ID, "Highest"),
  makeBug(203, HIGH_PRIORITY_FIELD_ID, "High"),
];

const aiStory: Story = {
  id: 107,
  name: "Generate release notes automatically",
  estimate: 2,
  story_type: "feature",
  epic_id: null,
  labels: [{ id: 28947, name: "AI" }],
  completed: true,
  completed_at: "2026-05-09T10:00:00.000Z",
  created_at: "2026-05-05T09:00:00.000Z",
  updated_at: "2026-05-09T10:00:00.000Z",
  custom_fields: [],
};

const completedStories = [...mockStories, aiStory];

// fetchBugs and fetchCompletedStories both POST /stories/search;
// route on the body so the mock is order-independent
const makeMockClient = () =>
  ({
    get: vi.fn().mockResolvedValue({ data: mockEpics }),
    post: vi.fn().mockImplementation((_url: string, body: { story_type?: string }) =>
      Promise.resolve({ data: body.story_type === "bug" ? mockBugs : completedStories })
    ),
  }) as unknown as ApiClient;

describe("buildWeeklyReport", () => {
  it("serialises the date range as ISO strings", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);

    expect(report.range).toEqual({
      start: "2026-05-04T00:00:00.000Z",
      end: "2026-05-10T23:59:59.999Z",
    });
  });

  it("counts completed stories and points", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);

    expect(report.storiesCompleted).toBe(7);
    // 2 + 3 + 1 + 5 + 0 (null estimate) + 2 + 2 = 15
    expect(report.pointsCompleted).toBe(15);
  });

  it("counts bugs cleared among completed stories", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);
    expect(report.bugsCleared).toBe(2); // IDs 103 and 106
  });

  it("summarises AI-labelled stories", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);

    expect(report.aiStories).toEqual([
      {
        id: 107,
        name: "Generate release notes automatically",
        completedAt: "2026-05-09T10:00:00.000Z",
        epicId: null,
      },
    ]);
  });

  it("counts epic-linked stories and their points", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);

    expect(report.epicStoriesCompleted).toBe(5); // all except 103 and 107
    // 2 + 3 + 5 + 0 (null estimate) + 2 = 12
    expect(report.epicPointsCompleted).toBe(12);
    expect(report.epicStories.every((story) => story.epicId !== null)).toBe(true);
  });

  it("summarises epics completed within the range", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);

    expect(report.completedEpics).toEqual([
      { id: 1, name: "Redesign Onboarding Flow" },
      { id: 2, name: "API Rate Limiting" },
    ]);
  });

  it("excludes epics that are not active for the dev group", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);
    // mock epics have no owners and no dev group membership
    expect(report.activeEpics).toEqual([]);
  });

  it("counts open bugs by priority", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);

    expect(report.openBugs).toEqual({
      total: 3,
      highestPriority: 2,
      highPriority: 1,
    });
  });

  it("produces a JSON-serialisable object", async () => {
    const report = await buildWeeklyReport(makeMockClient(), range);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
});
