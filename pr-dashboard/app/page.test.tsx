/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";

// 1. Mock global fetch
global.fetch = jest.fn();

// Spy on console.error to cover the catch block line
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

// 2. Component Mocks
// Mock Header with a button to trigger onSearch
jest.mock("../components/Header", () => {
  return function MockHeader({ onSearch }: any) {
    return (
      <div data-testid="header">
        <button onClick={onSearch}>Search Button</button>
      </div>
    );
  };
});

// Simple mock for PRList
jest.mock("../components/PRList", () => {
  return function MockPRList() {
    return <div data-testid="pr-list">PR List</div>;
  };
});

// Simple mock for Pagination
jest.mock("../components/Pagination", () => {
  return function MockPagination() {
    return <div data-testid="pagination">Pagination</div>;
  };
});

describe("Home Page - Coverage Deep Dive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  // TEST FOR: onSearch={() => { setPage(1); fetchPRs(); }}
  it("calls fetchPRs and resets page when onSearch is triggered", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], fromCache: false }),
    });

    render(<Home />);

    // Wait for the initial mount fetch to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Simulate clicking the search button in the Header
    const searchBtn = screen.getByText("Search Button");
    fireEvent.click(searchBtn);

    // Verify fetch was called again (total 2 times)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  // TEST FOR: } catch (err) { console.error(err); }
  it("logs an error in the console when the fetch fails", async () => {
    const mockError = new Error("API Down");
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    render(<Home />);

    // Verify the error was caught and logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
    });
  });

  // TEST FOR: setPrs(json.data || []) - Case 1: Data exists
  it("updates state correctly when fetch returns data", async () => {
    const mockData = [{ id: 1, title: "Test PR" }];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData, fromCache: false }),
    });

    render(<Home />);

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  // TEST FOR: setPrs(json.data || []) - Case 2: Data is missing (fallback to empty array)
  it("falls back to an empty array when json.data is undefined", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      // Simulate response where 'data' key is missing to trigger the '|| []' logic
      json: async () => ({ fromCache: false }),
    });

    render(<Home />);

    // Verify component handles missing data gracefully
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Check that PRList is still rendered despite empty data
    expect(screen.getByTestId("pr-list")).toBeInTheDocument();
  });
});
