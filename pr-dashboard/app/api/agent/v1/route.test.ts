/**
 * @jest-environment node
 */
import { POST } from "./route";
import { getPullRequests } from "../../../../lib/github";
import { GITHUB_TOOLS } from "../../../../lib/mcp-tools";
import { NextResponse } from "next/server";

// Mocking the GitHub service and tool definitions
jest.mock("../../../../lib/github", () => ({
  getPullRequests: jest.fn(),
}));

jest.mock("../../../../lib/mcp-tools", () => ({
  GITHUB_TOOLS: {
    get_pull_requests: { name: "get_pull_requests" },
  },
}));

describe("POST /api/mcp", () => {
  const baseUrl = "http://localhost:3000/api/mcp";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully executes the get_pull_requests tool", async () => {
    const mockResult = { data: [{ id: 1, title: "Test PR" }], fromCache: true };
    (getPullRequests as jest.Mock).mockResolvedValue(mockResult);

    const payload = {
      tool_name: "get_pull_requests",
      arguments: { owner: "vercel", repo: "next.js", page: 1, perPage: 10 },
    };

    // Create a mock request with the JSON payload
    const req = new Request(baseUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    const json = await response.json();

    // Assertions
    expect(getPullRequests).toHaveBeenCalledWith("vercel", "next.js", 1, 10);
    expect(response.status).toBe(200);
    expect(json.content[0].text).toBe(JSON.stringify(mockResult.data));
    expect(json.metadata.fromCache).toBe(true);
  });

  it("returns a 404 error if the tool_name is unknown", async () => {
    const payload = {
      tool_name: "unknown_tool",
      arguments: {},
    };

    const req = new Request(baseUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error).toBe("Tool not found");
  });

  it("returns a 500 error if the tool execution fails", async () => {
    // Force the service to throw an error to cover the catch block
    (getPullRequests as jest.Mock).mockRejectedValue(new Error("GitHub API Down"));

    const payload = {
      tool_name: "get_pull_requests",
      arguments: { owner: "owner", repo: "repo" },
    };

    const req = new Request(baseUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Tool execution failed");
  });
});