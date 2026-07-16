import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchEpics } from "./index";
import { mockEpics } from "../../mocks/shortcut";
import type { ApiClient } from "../../types";

const makeMockClient = (data: unknown) =>
  ({ get: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fetchEpics", () => {
  it("returns all epics from the API, unfiltered", async () => {
    const client = makeMockClient(mockEpics);
    const result = await fetchEpics(client);

    expect(result).toEqual(mockEpics);
  });

  it("calls GET /epics", async () => {
    const client = makeMockClient(mockEpics);
    await fetchEpics(client);
    expect(client.get).toHaveBeenCalledWith("/epics");
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
    await expect(fetchEpics(client)).rejects.toThrow("Request failed");
  });
});
