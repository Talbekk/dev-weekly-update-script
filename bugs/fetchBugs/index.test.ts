import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchBugs } from "./index";
import { mockStories } from "../../mocks/shortcut";
import type { ApiClient } from "../../types";

const makeMockClient = (data: unknown) =>
  ({ post: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fetchBugs", () => {
  it("calls POST /stories/search with the correct body", async () => {
    const client = makeMockClient(mockStories);
    await fetchBugs(client);

    expect(client.post).toHaveBeenCalledWith("/stories/search", {
      group_ids: ["64e3707d-6c9d-4786-aa8d-ff2b891c8def", "60e2d6c1-07bf-4df8-aa8e-6d32de0cb05a"],
      story_type: "bug",
      workflow_state_types: ["unstarted"],
      archived: false,
      epic_id: null,
    });
  });

  it("returns the full list of stories from the API response", async () => {
    const client = makeMockClient(mockStories);
    const result = await fetchBugs(client);
    expect(result).toHaveLength(mockStories.length);
  });

  it("returns an empty array when the API returns no bugs", async () => {
    const client = makeMockClient([]);
    const result = await fetchBugs(client);
    expect(result).toHaveLength(0);
  });

  it("rethrows API errors", async () => {
    const error = Object.assign(new Error("Request failed"), {
      isAxiosError: true,
      response: { status: 401, data: "Unauthorized" },
    });
    const client = {
      post: vi.fn().mockRejectedValue(error),
    } as unknown as ApiClient;

    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchBugs(client)).rejects.toThrow("Request failed");
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
    await expect(fetchBugs(client)).rejects.toThrow("Network Error");
  });
});
