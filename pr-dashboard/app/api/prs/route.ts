import { NextResponse } from "next/server";
import { getPullRequests } from "../../../lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner") || "vercel";
  const repo = searchParams.get("repo") || "next.js";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  try {
    const { data, fromCache } = await getPullRequests(
      owner,
      repo,
      page,
      perPage,
    );
    return NextResponse.json({ page, count: data.length, data, fromCache });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
