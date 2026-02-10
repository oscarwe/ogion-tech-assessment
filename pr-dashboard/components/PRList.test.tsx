/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PRList from "./PRList";

describe("PRList Component", () => {
  // Mock data representing the PR structure from GitHub API
  const mockPrs = [
    {
      id: 123,
      number: 101,
      title: "Fix bug in auth",
      html_url: "https://github.com/test/repo/pull/101",
      created_at: new Date().toISOString(),
      user: { login: "jdoe" },
      labels: [
        { name: "bug", color: "ff0000" },
        { name: "urgent", color: "00ff00" },
      ],
    },
  ];

  it("renders the loading state correctly", () => {
    // Test the branch: if (loading) return (...)
    render(<PRList prs={[]} loading={true} />);
    
    expect(screen.getByText(/fetching github data/i)).toBeInTheDocument();
    // Check for the presence of the spinner div via class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders an empty list when no PRs are provided", () => {
    // Test the branch where prs.map is called on an empty array
    const { container } = render(<PRList prs={[]} loading={false} />);
    
    const listItems = container.querySelectorAll("li");
    expect(listItems.length).toBe(0);
    // The container should still render the base div structure
    expect(container.firstChild).toHaveClass("bg-white");
  });

  it("renders a list of PRs with correct information", () => {
    // Test the main rendering logic for the list
    render(<PRList prs={mockPrs} loading={false} />);

    // Verify PR number and title
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("Fix bug in auth")).toBeInTheDocument();
    
    // Verify the link has the correct attributes
    const link = screen.getByRole("link", { name: "Fix bug in auth" });
    expect(link).toHaveAttribute("href", mockPrs[0].html_url);
    expect(link).toHaveAttribute("target", "_blank");

    // Verify user login is displayed
    expect(screen.getByText("jdoe")).toBeInTheDocument();

    // Verify the relative date (formatDistanceToNow)
    // Since we used current date, it should say "less than a minute" or similar
    expect(screen.getByText(/ago by/i)).toBeInTheDocument();
  });

  it("renders labels with dynamic styles", () => {
    // Test the internal labels.map branch
    render(<PRList prs={mockPrs} loading={false} />);

    const bugLabel = screen.getByText("bug");
    const urgentLabel = screen.getByText("urgent");

    expect(bugLabel).toBeInTheDocument();
    
    // Check if colors are applied correctly (converting hex to RGB as JSDOM does)
    // #ff0000 is rgb(255, 0, 0)
    expect(bugLabel).toHaveStyle({
      color: "rgb(255, 0, 0)",
      borderColor: "#ff0000",
    });

    expect(urgentLabel).toBeInTheDocument();
  });
});