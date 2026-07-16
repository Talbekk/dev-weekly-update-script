import type { SheetsClient, WeeklyReport } from "../../types";

export interface ScorecardUpdateResult {
  weekColumn: string;
  updatedLabels: string[];
  missingLabels: string[];
}

// Maps column C row labels in the scorecard to values from the report.
// "S" and "A" are the scorecard's severity tiers: S = Highest, A = High.
export const reportToMetrics = (report: WeeklyReport): Record<string, number> => ({
  "Points Cleared": report.pointsCompleted,
  "Stories Cleared": report.storiesCompleted,
  "Bugs Cleared": report.bugsCleared,
  "Epic Points Cleared": report.epicPointsCompleted,
  "Epic Stories Cleared": report.epicStoriesCompleted,
  "Epics Completed": report.completedEpics.length,
  "Stories Cleared By AI": report.aiStories.length,
  "Total Bugs": report.openBugs.total,
  "Total Bugs - S": report.openBugs.highestPriority,
  "Total Bugs - A": report.openBugs.highPriority,
  "Active Epics": report.activeEpics.length,
});

// The scorecard labels each column with the *reporting* Monday: the column
// dated 13/07/2026 holds the data for the week 06/07 - 12/07. So the target
// column is the Monday after the data week's start. Formatting uses local
// date parts (not the ISO string, which is UTC and can land a day early).
const toReportingMonday = (isoWeekStart: string): string => {
  const date = new Date(isoWeekStart);
  date.setDate(date.getDate() + 7);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

const columnToLetter = (index: number): string => {
  let letter = "";
  let n = index + 1;
  while (n > 0) {
    const remainder = (n - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
};

// Labels can appear more than once (e.g. "Points Cleared" is also in the
// placeholder block at the top); the data block is always the later occurrence.
const findLastRow = (labels: string[], target: string): number =>
  labels.lastIndexOf(target);

export const updateScorecard = async (
  client: SheetsClient,
  spreadsheetId: string,
  tabName: string,
  report: WeeklyReport
): Promise<ScorecardUpdateResult> => {
  const response = await client.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [`${tabName}!2:2`, `${tabName}!C:C`],
  });

  const [dateRow, labelColumn] = response.data.valueRanges ?? [];
  const dates: string[] = dateRow?.values?.[0] ?? [];
  const labels: string[] = (labelColumn?.values ?? []).map((row) => row[0] ?? "");

  const reportingMonday = toReportingMonday(report.range.start);
  const columnIndex = dates.indexOf(reportingMonday);
  if (columnIndex === -1) {
    throw new Error(`No column found in "${tabName}" row 2 for reporting Monday ${reportingMonday}`);
  }
  const weekColumn = columnToLetter(columnIndex);

  const metrics = reportToMetrics(report);
  const updatedLabels: string[] = [];
  const missingLabels: string[] = [];
  const data: { range: string; values: number[][] }[] = [];

  for (const [label, value] of Object.entries(metrics)) {
    const rowIndex = findLastRow(labels, label);
    if (rowIndex === -1) {
      missingLabels.push(label);
      continue;
    }
    data.push({
      range: `${tabName}!${weekColumn}${rowIndex + 1}`,
      values: [[value]],
    });
    updatedLabels.push(label);
  }

  if (data.length > 0) {
    await client.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data,
      },
    });
  }

  return { weekColumn, updatedLabels, missingLabels };
};
