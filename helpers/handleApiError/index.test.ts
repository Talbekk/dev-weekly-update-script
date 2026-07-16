import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleApiError } from "./index";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("handleApiError", () => {
  it("logs the status and data for API errors, then rethrows", () => {
    const error = Object.assign(new Error("Request failed"), {
      isAxiosError: true,
      response: { status: 401, data: "Unauthorized" },
    });

    expect(() => handleApiError(error)).toThrow("Request failed");
    expect(console.error).toHaveBeenCalledWith("❌ API Error:", 401, "Unauthorized");
  });

  it("logs a network error when no response was received, then rethrows", () => {
    const error = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      request: {},
      response: undefined,
    });

    expect(() => handleApiError(error)).toThrow("Network Error");
    expect(console.error).toHaveBeenCalledWith("❌ Network Error: No response received from Shortcut API");
  });

  it("logs the message for plain errors, then rethrows", () => {
    const error = new Error("Something broke");

    expect(() => handleApiError(error)).toThrow("Something broke");
    expect(console.error).toHaveBeenCalledWith("❌ Error:", "Something broke");
  });

  it("rethrows non-Error values without logging", () => {
    expect(() => handleApiError("boom")).toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });
});
