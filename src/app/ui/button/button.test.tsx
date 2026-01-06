import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

vi.mock("lucide-react", () => ({
  Loader2: ({ className }: { className?: string }) => (
    <svg data-testid="loading-spinner" className={className}>
      <circle />
    </svg>
  ),
}));

describe("Button", () => {
  describe("Accessibility", () => {
    it("should render a button with proper role", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should support aria-label for icon-only buttons", () => {
      render(
        <Button iconOnly aria-label="Search">
          <svg data-testid="search-icon" />
        </Button>
      );

      const button = screen.getByRole("button", { name: "Search" });
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should be disabled when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should have proper focus styles", () => {
      render(<Button>Focus me</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-visible:outline-none");
      expect(button).toHaveClass("focus-visible:ring-2");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole("button");

      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("should not be clickable when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should support aria-describedby", () => {
      render(
        <div>
          <Button aria-describedby="help-text">Submit</Button>
          <span id="help-text">Click to submit form</span>
        </div>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "help-text");
    });

    it("should maintain link semantics with asChild", () => {
      render(
        <Button asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      );

      const link = screen.getByRole("link", { name: "Go to Dashboard" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/dashboard");
    });
  });

  describe("Loading", () => {
    it("should show loading spinner when isLoading is true", () => {
      render(<Button isLoading>Save</Button>);

      const spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("should hide children content when loading", () => {
      render(<Button isLoading>Submit Form</Button>);

      expect(screen.queryByText("Submit Form")).not.toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should hide slots when loading", () => {
      render(
        <Button
          isLoading
          slots={{
            start: <span data-testid="start-icon">📁</span>,
            end: <span data-testid="end-icon">→</span>,
          }}
        >
          Upload
        </Button>
      );

      expect(screen.queryByTestId("start-icon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("end-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should show loading spinner with correct size", () => {
      const { rerender } = render(
        <Button isLoading size="sm">
          Save
        </Button>
      );

      let spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toHaveClass("w-4", "h-4");

      rerender(
        <Button isLoading size="lg">
          Save
        </Button>
      );
      spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toHaveClass("w-6", "h-6");
    });

    it("should render loading spinner in asChild mode", () => {
      render(
        <Button asChild isLoading>
          <a href="/save">Save</a>
        </Button>
      );

      const spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Slots", () => {
    it("should render slots", () => {
      render(
        <Button
          slots={{
            start: <span data-testid="start">←</span>,
            end: <span data-testid="end">→</span>,
          }}
        >
          Navigate
        </Button>
      );

      expect(screen.getByTestId("start")).toBeInTheDocument();
      expect(screen.getByTestId("end")).toBeInTheDocument();
      expect(screen.getByText("Navigate")).toBeInTheDocument();
    });

    it("should render slots in asChild mode", () => {
      render(
        <Button
          asChild
          slots={{
            start: <span data-testid="icon">📁</span>,
          }}
        >
          <a href="/files">Files</a>
        </Button>
      );

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Files")).toBeInTheDocument();
    });
  });

  describe("Icon Only", () => {
    it("should not render text content when iconOnly is true", () => {
      render(
        <Button iconOnly aria-label="Icon button">
          <svg data-testid="icon" />
        </Button>
      );

      const button = screen.getByRole("button");
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });

    it("should require aria-label for accessibility when iconOnly", () => {
      render(
        <Button iconOnly aria-label="Delete item">
          <svg />
        </Button>
      );

      const button = screen.getByRole("button", { name: "Delete item" });
      expect(button).toBeInTheDocument();
    });
  });

  describe("asChild Prop", () => {
    it("should render child element with button styling", () => {
      render(
        <Button asChild variant="primary">
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("bg-primary-600");
      expect(link).toHaveClass("text-white");
      expect(link).toHaveAttribute("href", "/test");
    });

    it("should merge className from child element", () => {
      render(
        <Button asChild className="custom-class">
          <a href="/test" className="child-class">
            Link
          </a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-class");
      expect(link).toHaveClass("child-class");
    });

    it("should pass through disabled state to child", () => {
      render(
        <Button asChild disabled>
          <a href="/test">Disabled Link</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("disabled");
    });

    it("should render slots in asChild mode", () => {
      render(
        <Button
          asChild
          slots={{
            start: <span data-testid="start-icon">🏠</span>,
            end: <span data-testid="end-icon">→</span>,
          }}
        >
          <a href="/home">Home</a>
        </Button>
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("should handle loading state in asChild mode", () => {
      render(
        <Button asChild isLoading>
          <a href="/save">Save</a>
        </Button>
      );

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });
});
