import { describe, it, expect, vi, beforeEach } from "vitest";
import { google } from "googleapis";
import { createSheetsClient } from "./index";

vi.mock("googleapis", () => {
  const mockSheetsInstance = { spreadsheets: { values: {} } };
  return {
    google: {
      auth: { GoogleAuth: vi.fn() },
      sheets: vi.fn().mockReturnValue(mockSheetsInstance),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createSheetsClient", () => {
  it("creates a GoogleAuth instance with the spreadsheets scope", () => {
    createSheetsClient();

    expect(google.auth.GoogleAuth).toHaveBeenCalledWith({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  });

  it("creates a v4 sheets client with the auth instance", () => {
    createSheetsClient();

    expect(google.sheets).toHaveBeenCalledWith({
      version: "v4",
      auth: expect.any(Object),
    });
  });

  it("returns the sheets client", () => {
    const client = createSheetsClient();
    expect(client.spreadsheets).toBeDefined();
  });
});
