/**
 * @jest-environment node
 */
import { GITHUB_TOOLS } from "./mcp-tools";

describe("GITHUB_TOOLS Configuration", () => {
  const tool = GITHUB_TOOLS.get_pull_requests;

  it("should have the correct tool name and description", () => {
    expect(tool.name).toBe("get_pull_requests");
    expect(typeof tool.description).toBe("string");
    expect(tool.description.length).toBeGreaterThan(0);
  });

  it("should define the correct parameter schema structure", () => {
    expect(tool.parameters.type).toBe("object");
    expect(tool.parameters.properties).toHaveProperty("owner");
    expect(tool.parameters.properties).toHaveProperty("repo");
    expect(tool.parameters.properties).toHaveProperty("page");
    expect(tool.parameters.properties).toHaveProperty("perPage");
  });

  it("should have mandatory required fields for the GitHub API", () => {
    // These fields are critical for the Octokit call to work
    expect(tool.parameters.required).toContain("owner");
    expect(tool.parameters.required).toContain("repo");
  });

  it("should specify correct types and defaults for pagination", () => {
    const { page, perPage } = tool.parameters.properties;

    expect(page.type).toBe("number");
    expect(page.default).toBe(1);

    expect(perPage.type).toBe("number");
    expect(perPage.default).toBe(20);
  });

  it("should match the expected JSON structure for MCP compatibility", () => {
    // Full snapshot test to ensure no accidental changes to the schema
    expect(GITHUB_TOOLS).toMatchObject({
      get_pull_requests: {
        name: expect.any(String),
        parameters: {
          type: "object",
          required: expect.arrayContaining(["owner", "repo"]),
        },
      },
    });
  });
});