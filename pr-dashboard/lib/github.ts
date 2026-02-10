import { Octokit } from "@octokit/rest";

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Simple In-Memory Cache
// Key: Repository string, Value: { data: PR[], timestamp: number }
const cache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute cache

export async function getPullRequests(
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 20,
) {
  // Generate a cache key based on the repository and pagination parameters
  const cacheKey = `${owner}/${repo}-p${page}-l${perPage}`;
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return { data: cached.data, fromCache: true };
    }
  }

  const response = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    per_page: perPage,
    page: page,
    sort: "created",
    direction: "desc",
  });

  const prs = response.data;
  cache.set(cacheKey, { data: prs, timestamp: now });
  return { data: prs, fromCache: false };
}
