import { describe, it, expect, vi } from "vitest";
import { updateScorecard, reportToMetrics } from "./index";
import type { SheetsClient, WeeklyReport } from "../../types";

const report: WeeklyReport = {
  range: {
    start: "2026-07-06T00:00:00.000Z",
    end: "2026-07-12T23:59:59.999Z",
  },
  storiesCompleted: 9,
  pointsCompleted: 21,
  bugsCleared: 2,
  aiStories: [
    { id: 107, name: "Revert Average Scoring Value", completedAt: "2026-07-09T09:24:17Z", epicId: null },
  ],
  epicStoriesCompleted: 3,
  epicPointsCompleted: 7,
  epicStories: [],
  activeEpics: [
    { id: 4, name: "Data Hamster Tooling" },
    { id: 5, name: "QB2 Short Form" },
  ],
  completedEpics: [{ id: 1, name: "Social media component" }],
  openBugs: {
    total: 47,
    highestPriority: 0,
    highPriority: 9,
  },
};

// Mirrors the real scorecard: dates start at column E in row 2,
// column C has a placeholder block whose labels overlap the data block
const dateRow = ["", "", "01/01/2024", "", "29/06/2026", "06/07/2026", "13/07/2026"];
const labelColumn = [
  [], // C1 empty
  ["01/01/2024"],
  [],
  [],
  ["Open Bugs (Med - VH) (count)"],
  ["Points Cleared"], // placeholder block duplicate
  ["Points Cleared"], // data block - the one that should be written
  ["Stories Cleared"],
  ["Bugs Cleared"],
  ["Epic Points Cleared"],
  ["Epic Stories Cleared"],
  ["Epics Completed"],
  ["Stories Cleared By AI"],
  ["Total Bugs"],
  ["Total Bugs - S"],
  ["Total Bugs - A"],
  ["Total Bugs (Support)"],
  ["Active Epics"],
];

const makeMockClient = () =>
  ({
    spreadsheets: {
      values: {
        batchGet: vi.fn().mockResolvedValue({
          data: {
            valueRanges: [{ values: [dateRow] }, { values: labelColumn }],
          },
        }),
        batchUpdate: vi.fn().mockResolvedValue({}),
      },
    },
  }) as unknown as SheetsClient;

describe("reportToMetrics", () => {
  it("maps the report to scorecard row labels", () => {
    expect(reportToMetrics(report)).toEqual({
      "Points Cleared": 21,
      "Stories Cleared": 9,
      "Bugs Cleared": 2,
      "Epic Points Cleared": 7,
      "Epic Stories Cleared": 3,
      "Epics Completed": 1,
      "Stories Cleared By AI": 1,
      "Total Bugs": 47,
      "Total Bugs - S": 0,
      "Total Bugs - A": 9,
      "Active Epics": 2,
    });
  });
});

describe("updateScorecard", () => {
  it("reads the date row and label column from the right tab", async () => {
    const client = makeMockClient();
    await updateScorecard(client, "sheet-id", "Dev", report);

    expect(client.spreadsheets.values.batchGet).toHaveBeenCalledWith({
      spreadsheetId: "sheet-id",
      ranges: ["Dev!2:2", "Dev!C:C"],
    });
  });

  it("writes each metric into the column labelled with the reporting Monday (the Monday after the data week)", async () => {
    const client = makeMockClient();
    await updateScorecard(client, "sheet-id", "Dev", report);

    const call = vi.mocked(client.spreadsheets.values.batchUpdate).mock.calls[0][0] as unknown as {
      requestBody: { valueInputOption: string; data: { range: string; values: number[][] }[] };
    };

    expect(call.requestBody.valueInputOption).toBe("USER_ENTERED");
    // data week starts 06/07/2026 -> reporting Monday 13/07/2026, at index 6 -> column G
    expect(call.requestBody.data).toContainEqual({ range: "Dev!G8", values: [[9]] }); // Stories Cleared
    expect(call.requestBody.data).toContainEqual({ range: "Dev!G14", values: [[47]] }); // Total Bugs
    expect(call.requestBody.data).toContainEqual({ range: "Dev!G18", values: [[2]] }); // Active Epics
  });

  it("writes Points Cleared to the last occurrence of the label, not the placeholder block", async () => {
    const client = makeMockClient();
    await updateScorecard(client, "sheet-id", "Dev", report);

    const call = vi.mocked(client.spreadsheets.values.batchUpdate).mock.calls[0][0] as unknown as {
      requestBody: { data: { range: string; values: number[][] }[] };
    };

    expect(call.requestBody.data).toContainEqual({ range: "Dev!G7", values: [[21]] });
    expect(call.requestBody.data).not.toContainEqual({ range: "Dev!G6", values: [[21]] });
  });

  it("returns the updated and missing labels", async () => {
    const client = makeMockClient();
    const result = await updateScorecard(client, "sheet-id", "Dev", report);

    expect(result.weekColumn).toBe("G");
    expect(result.updatedLabels).toHaveLength(11);
    expect(result.missingLabels).toEqual([]);
  });

  it("reports labels that are not present in the sheet without writing them", async () => {
    const client = makeMockClient();
    const truncatedLabels = labelColumn.filter((row) => row[0] !== "Total Bugs - S");
    vi.mocked(client.spreadsheets.values.batchGet).mockResolvedValue({
      data: { valueRanges: [{ values: [dateRow] }, { values: truncatedLabels }] },
    } as never);

    const result = await updateScorecard(client, "sheet-id", "Dev", report);

    expect(result.missingLabels).toEqual(["Total Bugs - S"]);
    expect(result.updatedLabels).toHaveLength(10);
  });

  it("throws a clear error when the week's column is not in the sheet", async () => {
    const client = makeMockClient();
    const staleReport = { ...report, range: { start: "2027-01-04T00:00:00.000Z", end: "2027-01-10T23:59:59.999Z" } };

    await expect(updateScorecard(client, "sheet-id", "Dev", staleReport)).rejects.toThrow(
      'No column found in "Dev" row 2 for reporting Monday 11/01/2027'
    );
    expect(client.spreadsheets.values.batchUpdate).not.toHaveBeenCalled();
  });
});
