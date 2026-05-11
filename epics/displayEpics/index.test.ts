import { describe, it, expect, vi, beforeEach } from "vitest";
import { displayEpics } from "./index";
import { mockEpics } from "../../mocks/shortcut";

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("displayEpics", () => {
  it("logs the correct count of epics", () => {
    const epics = mockEpics.slice(0, 2);
    displayEpics(epics);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("2 completed epics")
    );
  });

  it("logs each epic's name and ID", () => {
    const epics = mockEpics.slice(0, 2);
    displayEpics(epics);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Redesign Onboarding Flow")
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("API Rate Limiting")
    );
  });

  it("handles an empty list without throwing", () => {
    expect(() => displayEpics([])).not.toThrow();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("0 completed epics")
    );
  });
});
