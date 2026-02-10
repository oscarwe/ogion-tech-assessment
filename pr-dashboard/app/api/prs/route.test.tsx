/**
 * @jest-environment node
 */
import { GET } from "./route";
import { getPullRequests } from "../../../lib/github";

// Add global Request/Response if they are missing in your Node version
if (typeof Request === 'undefined') {
  const { Request, Response, Headers } = require('undici');
  global.Request = Request;
  global.Response = Response;
  global.Headers = Headers;
}

// Mock the GitHub library to prevent real API calls
jest.mock("../../../lib/github", () => ({
  getPullRequests: jest.fn(),
}));

describe("GET /api/prs", () => {
  const baseUrl = "http://localhost:3000/api/prs";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns pull requests with default parameters when no query params are provided", async () => {
    const mockData = { data: [{ id: 1, title: "Mock PR" }], fromCache: false };
    (getPullRequests as jest.Mock).mockResolvedValue(mockData);

    // Create a request without search params
    const req = new Request(baseUrl);
    const response = await GET(req);
    const json = await response.json();

    // Verify the library was called with defaults: vercel, next.js, page 1, perPage 20
    expect(getPullRequests).toHaveBeenCalledWith("vercel", "next.js", 1, 20);
    expect(response.status).toBe(200);
    expect(json).toEqual({
      page: 1,
      count: 1,
      data: mockData.data,
      fromCache: false,
    });
  });

  it("correctly parses custom query parameters", async () => {
    (getPullRequests as jest.Mock).mockResolvedValue({
      data: [],
      fromCache: true,
    });

    // Create a request with custom params
    const url = `${baseUrl}?owner=facebook&repo=react&page=2&perPage=50`;
    const req = new Request(url);
    const response = await GET(req);

    // Verify custom params were passed to the library
    expect(getPullRequests).toHaveBeenCalledWith("facebook", "react", 2, 50);
    expect(response.status).toBe(200);
  });

  it("returns a 500 error when the GitHub library throws an exception", async () => {
    // Force the library to throw an error to cover the catch block
    (getPullRequests as jest.Mock).mockRejectedValue(
      new Error("GitHub API Error"),
    );

    const req = new Request(baseUrl);
    const response = await GET(req);
    const json = await response.json();

    // Verify error handling
    expect(response.status).toBe(500);
    expect(json).toEqual({ error: "Failed" });
  });

  it("handles missing data by returning count 0", async () => {
    // Case where data array is empty
    (getPullRequests as jest.Mock).mockResolvedValue({
      data: [],
      fromCache: false,
    });

    const req = new Request(baseUrl);
    const response = await GET(req);
    const json = await response.json();

    expect(json.count).toBe(0);
    expect(json.data).toEqual([]);
  });
});
