import { NextResponse } from 'next/server';
import { getPullRequests } from '../../../../lib/github';
import { GITHUB_TOOLS } from '../../../../lib/mcp-tools';

export async function POST(request: Request) {
  const { tool_name, arguments: args } = await request.json();

  // Routeador de herramientas
  if (tool_name === GITHUB_TOOLS.get_pull_requests.name) {
    try {
      const { owner, repo, page, perPage } = args;
      const result = await getPullRequests(owner, repo, page, perPage);
      
      return NextResponse.json({
        content: [{ 
          type: "text", 
          text: JSON.stringify(result.data) 
        }],
        metadata: { fromCache: result.fromCache }
      });
    } catch (error) {
      return NextResponse.json({ error: "Tool execution failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Tool not found" }, { status: 404 });
}