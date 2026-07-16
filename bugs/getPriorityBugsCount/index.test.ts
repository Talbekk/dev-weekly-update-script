import { describe, it, expect } from "vitest";
import { getPriorityBugsCount } from "./index";
import { HIGH_PRIORITY_FIELD_ID, HIGHEST_PRIORITY_FIELD_ID } from "../../constants";
import type { Story } from "../../types";

const makeBug = (fieldId: string, value: string): Story => ({
  id: Math.floor(Math.random() * 100000),
  name: "Sample bug",
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

describe("getPriorityBugsCount", () => {
  it("counts bugs with the Highest priority custom field", () => {
    const bugs = [
      makeBug(HIGHEST_PRIORITY_FIELD_ID, "Highest"),
      makeBug(HIGHEST_PRIORITY_FIELD_ID, "Highest"),
      makeBug(HIGH_PRIORITY_FIELD_ID, "High"),
    ];

    expect(getPriorityBugsCount(bugs, "Highest")).toBe(2);
  });

  it("counts bugs with the High priority custom field", () => {
    const bugs = [
      makeBug(HIGH_PRIORITY_FIELD_ID, "High"),
      makeBug(HIGHEST_PRIORITY_FIELD_ID, "Highest"),
    ];

    expect(getPriorityBugsCount(bugs, "High")).toBe(1);
  });

  it("counts bugs with the Medium priority custom field", () => {
    const bugs = [
      makeBug(HIGH_PRIORITY_FIELD_ID, "Medium"),
      makeBug(HIGH_PRIORITY_FIELD_ID, "High"),
    ];

    expect(getPriorityBugsCount(bugs, "Medium")).toBe(1);
  });

  it("counts bugs with the Low priority custom field", () => {
    const bugs = [
      makeBug(HIGH_PRIORITY_FIELD_ID, "Low"),
      makeBug(HIGH_PRIORITY_FIELD_ID, "Low"),
      makeBug(HIGH_PRIORITY_FIELD_ID, "High"),
    ];

    expect(getPriorityBugsCount(bugs, "Low")).toBe(2);
  });

  it("returns 0 when no bugs match the priority level", () => {
    const bugs = [makeBug(HIGH_PRIORITY_FIELD_ID, "High")];

    expect(getPriorityBugsCount(bugs, "Highest")).toBe(0);
  });

  it("returns 0 for an empty bugs array", () => {
    expect(getPriorityBugsCount([], "High")).toBe(0);
  });

  it("ignores custom fields with a matching field_id but a different value", () => {
    const bugs = [makeBug(HIGHEST_PRIORITY_FIELD_ID, "High")];

    expect(getPriorityBugsCount(bugs, "Highest")).toBe(0);
  });

  it("ignores custom fields with the matching value but a different field_id", () => {
    const bugs = [makeBug(HIGH_PRIORITY_FIELD_ID, "Highest")];

    expect(getPriorityBugsCount(bugs, "Highest")).toBe(0);
  });
});
