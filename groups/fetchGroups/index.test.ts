import { describe, expect, it, vi } from "vitest";
import { mockGroups } from "../../mocks/shortcut";
import { ApiClient } from "../../types";
import { fetchGroups } from ".";


const makeMockClient = (data: unknown) =>
  ({ get: vi.fn().mockResolvedValue({ data }) }) as unknown as ApiClient;

describe("fetchGroups", () => {
    it("returns groups from the API", async () => {
        const client = makeMockClient(mockGroups);
        const result = await fetchGroups(client);
        expect(result.length).toEqual(3);
        expect(result).toEqual(mockGroups);
    });

    it("calls GET /groups", async () => {
        const client = makeMockClient(mockGroups);
        await fetchGroups(client);
        expect(client.get).toHaveBeenCalledWith("/groups");
    });

    it("rethrows API errors", async () => {
        const error = new Error("Request failed");
        (error as any).isAxiosError = true;
        (error as any).response = { status: 401, data: "Unauthorized" };
        const client = ({ get: vi.fn().mockRejectedValue(error) }) as unknown as ApiClient;
        await expect(fetchGroups(client)).rejects.toThrow("Request failed");
    });
});