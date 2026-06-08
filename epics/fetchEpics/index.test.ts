import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchEpics } from "./index";
import { mockEpics } from "../../mocks/shortcut";
import type { ApiClient, DateRange } from "../../types";

const range: DateRange = {
  start: new Date("2026-05-04T00:00:00.000Z"), // Mon
  end: new Date("2026-05-10T23:59:59.999Z"),   // Sun
};

const makeMockClient = (data: unknown) =>
  ({ get: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fetchEpics", () => {
  it("returns only epics completed within the date range", async () => {
    const client = makeMockClient(mockEpics);
    const result = await fetchEpics(client, range);

    // IDs 1 and 2 fall in range; ID 3 is April, ID 4 is not completed
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual([1, 2]);
  });

  it("calls GET /epics", async () => {
    const client = makeMockClient(mockEpics);
    await fetchEpics(client, range);
    expect(client.get).toHaveBeenCalledWith("/epics");
  });

  it("returns an empty array when no epics fall in range", async () => {
    const client = makeMockClient(mockEpics);
    const result = await fetchEpics(client, {
      start: new Date("2020-01-01"),
      end: new Date("2020-01-07"),
    });
    expect(result).toHaveLength(0);
  });

  it("excludes epics that are not marked completed", async () => {
    const client = makeMockClient(mockEpics);
    const result = await fetchEpics(client, range);
    expect(result.every((e) => e.completed)).toBe(true);
  });

  it("excludes epics with a null completed_at", async () => {
    const client = makeMockClient(mockEpics);
    const result = await fetchEpics(client, range);
    expect(result.every((e) => e.completed_at !== null)).toBe(true);
  });

  it("rethrows API errors", async () => {
    const error = Object.assign(new Error("Request failed"), {
      isAxiosError: true,
      response: { status: 401, data: "Unauthorized" },
    });
    const client = {
      get: vi.fn().mockRejectedValue(error),
    } as unknown as ApiClient;

    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchEpics(client, range)).rejects.toThrow("Request failed");
  });
});
