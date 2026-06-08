import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWorkflows } from ".";
import { mockWorkflows } from "../../mocks/shortcut";
import type { ApiClient } from "../../types";

const makeMockClient = (data: unknown) =>
  ({ get: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fetchWorkflows", () => {
  it("returns workflows from the API", async () => {
    const client = makeMockClient(mockWorkflows);
    const result = await fetchWorkflows(client);
    expect(result).toEqual(mockWorkflows);
    expect(result).toHaveLength(2);
  });

  it("calls GET /workflows", async () => {
    const client = makeMockClient(mockWorkflows);
    await fetchWorkflows(client);
    expect(client.get).toHaveBeenCalledWith("/workflows");
  });

  it("returns an empty array when the API returns no workflows", async () => {
    const client = makeMockClient([]);
    const result = await fetchWorkflows(client);
    expect(result).toEqual([]);
  });

  it("rethrows API errors", async () => {
    const error = Object.assign(new Error("Request failed"), {
      isAxiosError: true,
      response: { status: 401, data: "Unauthorized" },
    });
    const client = { get: vi.fn().mockRejectedValue(error) } as unknown as ApiClient;
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchWorkflows(client)).rejects.toThrow("Request failed");
  });

  it("rethrows network errors with no response", async () => {
    const error = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      request: {},
    });
    const client = { get: vi.fn().mockRejectedValue(error) } as unknown as ApiClient;
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchWorkflows(client)).rejects.toThrow("Network Error");
  });
});
