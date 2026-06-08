import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { createApiClient } from ".";

vi.mock("axios", () => ({
  default: {
    create: vi.fn().mockReturnValue({}),
  },
}));

describe("createApiClient", () => {
  const originalToken = process.env.SHORTCUT_API_TOKEN;

  beforeEach(() => {
    process.env.SHORTCUT_API_TOKEN = "test-token-123";
    vi.mocked(axios.create).mockClear();
  });

  afterEach(() => {
    process.env.SHORTCUT_API_TOKEN = originalToken;
  });

  it("calls axios.create with the correct baseURL", () => {
    createApiClient();
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://api.app.shortcut.com/api/v3",
      })
    );
  });

  it("includes the Shortcut-Token header from env", () => {
    createApiClient();
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          "Shortcut-Token": "test-token-123",
        }),
      })
    );
  });

  it("includes the Content-Type header", () => {
    createApiClient();
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("returns the axios instance", () => {
    const fakeInstance = { get: vi.fn() };
    vi.mocked(axios.create).mockReturnValueOnce(fakeInstance as any);
    const client = createApiClient();
    expect(client).toBe(fakeInstance);
  });
});
