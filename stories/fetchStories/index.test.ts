import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchStories } from "./index";
import { mockStories } from "../../mocks/shortcut";
import type { ApiClient, DateRange } from "../../types";

const range: DateRange = {
  start: new Date("2026-05-04T00:00:00.000Z"),
  end: new Date("2026-05-10T23:59:59.999Z"),
};

const makeMockClient = (data: unknown) =>
  ({ post: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fetchStories", () => {
  it("calls POST /stories/search with the correct body", async () => {
    const client = makeMockClient(mockStories);
    await fetchStories(client, range);

    expect(client.post).toHaveBeenCalledWith("/stories/search", {
      completed_at_start: range.start.toISOString(),
      completed_at_end: range.end.toISOString(),
      group_id: "64e3707d-6c9d-4786-aa8d-ff2b891c8def",
    });
  });

  it("returns the full list of stories from the API response", async () => {
    const client = makeMockClient(mockStories);
    const result = await fetchStories(client, range);
    expect(result).toHaveLength(mockStories.length);
  });

  it("returns an empty array when the API returns no stories", async () => {
    const client = makeMockClient([]);
    const result = await fetchStories(client, range);
    expect(result).toHaveLength(0);
  });

  it("correctly identifies bugs in the story set", async () => {
    const client = makeMockClient(mockStories);
    const result = await fetchStories(client, range);
    const bugs = result.filter((s) => s.story_type === "bug");
    expect(bugs).toHaveLength(2); // IDs 103 and 106
  });

  it("correctly identifies stories linked to epics", async () => {
    const client = makeMockClient(mockStories);
    const result = await fetchStories(client, range);
    const epicStories = result.filter((s) => s.epic_id !== null);
    expect(epicStories).toHaveLength(5); // all except ID 103
  });

  it("handles stories with null estimates without throwing", async () => {
    const client = makeMockClient(mockStories);
    const result = await fetchStories(client, range);
    const total = result.reduce((sum, s) => sum + (s.estimate ?? 0), 0);
    // 2 + 3 + 1 + 5 + 0 + 2 = 13
    expect(total).toBe(13);
  });

  it("rethrows network errors", async () => {
    const error = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      request: {},
      response: undefined,
    });
    const client = {
      post: vi.fn().mockRejectedValue(error),
    } as unknown as ApiClient;

    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchStories(client, range)).rejects.toThrow("Network Error");
  });
});
