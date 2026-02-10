# 🚀 GitHub PR Monitor & MCP Tool Layer

A professional-grade dashboard for monitoring GitHub Pull Requests, built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. This project demonstrates advanced patterns in React state management, server-side caching, and AI-ready architecture.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Octokit (Official GitHub SDK)
- **Date Handling**: date-fns (Hydration-safe implementation)

---

## ✨ Key Features & Architectural Patterns

### 1. Advanced Component Architecture

- **Container/Presenter Pattern**: Business logic and data fetching are decoupled from presentational components (`Header`, `PRList`, `Pagination`).
- **Sticky Layout**: A specialized Flexbox layout ensures the Header and Footer remain fixed while only the PR list scrolls, providing a modern App-like experience.
- **Atomic Segmentation**: Sub-components like `LimitInput` and `SearchInput` are isolated for better maintainability and testing.

### 2. Intelligent Server-Side Caching

- **Memory Management**: Implemented a custom `Map`-based cache with a **TTL (Time To Live) of 60 seconds**.
- **Cache-Key Hashing**: Cache keys are dynamically generated based on `owner`, `repo`, `page`, and `perPage` to ensure data consistency across different queries.
- **Cache Observability**: The UI explicitly notifies the user when data is served from cache through a "Cached" badge indicator.

### 3. Hydration & Performance

- **Hydration Mismatch Fix**: Implemented a "Client-Side Mounting" strategy for relative dates (`formatDistanceToNow`) to prevent discrepancies between Server-rendered HTML and Client-side hydration.
- **Optimistic UI**: Use of Skeleton loaders and smooth scroll resets to `top: 0` during pagination to improve perceived performance.

### 4. 🤖 Agent-Ready Layer (MCP Style)

The application is designed for the future of AI. It exposes its core logic as **structured tools** that an AI Agent (like Claude or GPT) can consume.

- **Structured Tool Definition**: Documented JSON Schema for the `get_pull_requests` tool.
- **AI Feedback Loop**: The API returns metadata (like cache status) allowing Agents to reason about data freshness.

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- A GitHub Personal Access Token (PAT)

### 2. Environment Variables

Create a `.env.local` file in the pr-dashboard directory:

env
GITHUB_TOKEN=your_github_pat_here

### 3. Installation

npm install
npm run dev

Open http://localhost:3000 to see the result.

# To test the Agent layer (MCP) manually:

curl -X POST http://localhost:3000/api/agent/v1 \
 -H "Content-Type: application/json" \
 -d '{"tool_name": "get_pull_requests", "arguments": {"owner": "vercel", "repo": "next.js"}}'

Testing Scenarios
To validate the robustness of the implementation, consider the following repositories:

- \*\*facebook/react: High volume of PRs to test pagination and cache performance.
- \*\*microsoft/vscode: High frequency of "Draft" PRs to test UI badges.

## 🧪 Testing Suite & Quality Assurance

The project maintains 100% test coverage across the core business logic, components, and API routes using **Jest** and **React Testing Library**.

### 1. Coverage Overview
- **Unit Tests**: Isolated testing of logic-heavy functions in `lib/github.ts`.
- **Component Tests**: Behavioral testing for user interactions in the UI.
- **Integration Tests**: End-to-end verification of Next.js API Routes and Request/Response flows.
- **MCP Validation**: Schema integrity checks for the AI Tooling layer.

### 2. Execution Commands

```bash
# Run all tests
npm run test

# Run tests with full coverage report
npm run test:coverage

# Run tests in watch mode during development
npx jest --watch
