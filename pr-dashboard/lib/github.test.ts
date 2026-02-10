/**
 * @jest-environment node
 */
import { Octokit } from "@octokit/rest";

// 1. Mock setup with Proxy pattern to avoid hoisting issues
let mockPullsList = jest.fn();

jest.mock("@octokit/rest", () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        pulls: {
          list: (...args: any[]) => mockPullsList(...args),
        },
      },
    })),
  };
});

// 2. Delayed import
import { getPullRequests } from "./github";

describe("github lib - getPullRequests Coverage", () => {
  const owner = "test-owner";
  const repo = "test-repo";

  beforeEach(() => {
    mockPullsList = jest.fn();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // TEST FOR DEFAULT PARAMETERS: page = 1, perPage = 20
  it("uses default parameters (page=1, perPage=20) when they are not provided", async () => {
    mockPullsList.mockResolvedValue({ data: [] });

    // Call only with required arguments
    await getPullRequests(owner, repo);

    expect(mockPullsList).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        per_page: 20,
      }),
    );
  });

  // TEST FOR CUSTOM PARAMETERS: ensuring the defaults are overridden
  it("overrides default parameters when custom values are provided", async () => {
    mockPullsList.mockResolvedValue({ data: [] });

    // Call with specific values
    await getPullRequests(owner, repo, 5, 50);

    expect(mockPullsList).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 5,
        per_page: 50,
      }),
    );
  });

  it("fetches data from Octokit and populates cache", async () => {
    const mockData = [{ id: 1, title: "New PR" }];
    mockPullsList.mockResolvedValue({ data: mockData });

    const result = await getPullRequests("org", "repo", 1, 10);

    expect(result).toEqual({ data: mockData, fromCache: false });
    expect(mockPullsList).toHaveBeenCalledTimes(1);
  });

  it("returns data from cache within TTL", async () => {
    mockPullsList.mockResolvedValue({ data: [{ id: 1 }] });

    // First call
    await getPullRequests("cache-user", "cache-repo", 1, 10);
    // Second call (same params)
    const result = await getPullRequests("cache-user", "cache-repo", 1, 10);

    expect(mockPullsList).toHaveBeenCalledTimes(1);
    expect(result.fromCache).toBe(true);
  });

  it("refetches data after TTL expires", async () => {
    mockPullsList.mockResolvedValue({ data: [] });

    await getPullRequests("ttl-user", "ttl-repo", 1, 10);

    // Fast-forward 61 seconds
    jest.advanceTimersByTime(61000);

    const result = await getPullRequests("ttl-user", "ttl-repo", 1, 10);

    expect(mockPullsList).toHaveBeenCalledTimes(2);
    expect(result.fromCache).toBe(false);
  });
});
