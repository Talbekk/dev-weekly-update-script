import { describe, it, expect } from "vitest";
import { filterActiveEpics } from ".";
import { mockEpics } from "../../mocks/shortcut";

const DEV_GROUP_ID = "60e2d6c1-07bf-4df8-aa8e-6d32de0cb05a";

describe("filterActiveEpics", () => {
  it("returns only epics that are started, unarchived, incomplete, have an owner, and belong to the group", () => {
    const result = filterActiveEpics(mockEpics, DEV_GROUP_ID);
    expect(result.every((e) => !e.completed)).toBe(true);
    expect(result.every((e) => !e.archived)).toBe(true);
    expect(result.every((e) => e.started)).toBe(true);
    expect(result.every((e) => e.owner_ids.length > 0)).toBe(true);
    expect(result.every((e) => e.group_ids.includes(DEV_GROUP_ID))).toBe(true);
  });

  it("excludes completed epics", () => {
    const epics = [
      { ...mockEpics[0], completed: true, started: true, archived: false, owner_ids: ["u1"], group_ids: [DEV_GROUP_ID] },
    ];
    expect(filterActiveEpics(epics, DEV_GROUP_ID)).toHaveLength(0);
  });

  it("excludes archived epics", () => {
    const epics = [
      { ...mockEpics[0], completed: false, started: true, archived: true, owner_ids: ["u1"], group_ids: [DEV_GROUP_ID] },
    ];
    expect(filterActiveEpics(epics, DEV_GROUP_ID)).toHaveLength(0);
  });

  it("excludes epics that have not started", () => {
    const epics = [
      { ...mockEpics[0], completed: false, started: false, archived: false, owner_ids: ["u1"], group_ids: [DEV_GROUP_ID] },
    ];
    expect(filterActiveEpics(epics, DEV_GROUP_ID)).toHaveLength(0);
  });

  it("excludes epics with no owners", () => {
    const epics = [
      { ...mockEpics[0], completed: false, started: true, archived: false, owner_ids: [], group_ids: [DEV_GROUP_ID] },
    ];
    expect(filterActiveEpics(epics, DEV_GROUP_ID)).toHaveLength(0);
  });

  it("excludes epics not belonging to the given group", () => {
    const epics = [
      { ...mockEpics[0], completed: false, started: true, archived: false, owner_ids: ["u1"], group_ids: ["other-group-id"] },
    ];
    expect(filterActiveEpics(epics, DEV_GROUP_ID)).toHaveLength(0);
  });

  it("returns an empty array when given an empty list", () => {
    expect(filterActiveEpics([], DEV_GROUP_ID)).toEqual([]);
  });
});
