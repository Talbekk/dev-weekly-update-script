import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCustomFields } from "./index";
import { mockCustomFields } from "../../mocks/shortcut";
import type { ApiClient } from "../../types";

const makeMockClient = (data: unknown) =>
  ({ get: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("fetchCustomFields", () => {
  it("returns custom fields from the API", async () => {
    const client = makeMockClient(mockCustomFields);
    const result = await fetchCustomFields(client);
    expect(result).toEqual(mockCustomFields);
    expect(result).toHaveLength(2);
  });

  it("calls GET /custom-fields", async () => {
    const client = makeMockClient(mockCustomFields);
    await fetchCustomFields(client);
    expect(client.get).toHaveBeenCalledWith("/custom-fields");
  });

  it("returns an empty array when the API returns no custom fields", async () => {
    const client = makeMockClient([]);
    const result = await fetchCustomFields(client);
    expect(result).toEqual([]);
  });

  it("rethrows API errors", async () => {
    const error = Object.assign(new Error("Request failed"), {
      isAxiosError: true,
      response: { status: 401, data: "Unauthorized" },
    });
    const client = { get: vi.fn().mockRejectedValue(error) } as unknown as ApiClient;
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchCustomFields(client)).rejects.toThrow("Request failed");
  });

  it("rethrows network errors with no response", async () => {
    const error = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      request: {},
    });
    const client = { get: vi.fn().mockRejectedValue(error) } as unknown as ApiClient;
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchCustomFields(client)).rejects.toThrow("Network Error");
  });
});
