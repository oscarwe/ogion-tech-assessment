/**
 * MCP Tool Definition for GitHub PR Monitor
 */
export const GITHUB_TOOLS = {
  get_pull_requests: {
    name: "get_pull_requests",
    description: "Recupera una lista paginada de Pull Requests abiertos de un repositorio de GitHub.",
    parameters: {
      type: "object",
      properties: {
        owner: { type: "string", description: "El dueño del repositorio (ej: vercel)" },
        repo: { type: "string", description: "El nombre del repositorio (ej: next.js)" },
        page: { type: "number", description: "Número de página para resultados", default: 1 },
        perPage: { type: "number", description: "Cantidad de PRs por página (max 100)", default: 20 }
      },
      required: ["owner", "repo"]
    }
  }
};